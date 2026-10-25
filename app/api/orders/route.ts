import { NextResponse } from 'next/server';

import { createOrderInSupabase } from '@/lib/orders/create-order';
import { verifiedCustomerId } from '@/lib/orders/customer-auth';
import { isLocalStudioRequest } from '@/lib/studio-bridge';
import { submitStagedRebirthOrder, StudioMenuError } from '@/lib/studio-menu-orders';
import { parseCreateOrderPayloadOrThrow } from '@/lib/orders/order-validation';
import { getRuntimePublicSiteSettings } from '@/lib/site-settings-runtime';
import { oracleOrdersEnabled, submitOracleOrder, OracleOrderError } from '@/lib/oracle-order-api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = parseCreateOrderPayloadOrThrow(body);

    // Full Rebirth checkout only enters independent PostgreSQL in local studio mode.
    if (isLocalStudioRequest(request)) {
      const key=typeof body.requestKey==='string'?body.requestKey:'';
      const saved=await submitStagedRebirthOrder(key,payload);
      return NextResponse.json({ok:true,orderId:saved.id,orderNumber:null,
        reference:'#'+saved.id.slice(0,8).toUpperCase(),tableReference:payload.tableReference,
        subtotal:Number(saved.subtotal_cents)/100,studioMode:true});
    }

    if (oracleOrdersEnabled()) {
      const settings = await getRuntimePublicSiteSettings();
      // No delivery order may enter Oracle while real service coverage
      // and fee handling remain unapproved. This is independent of UI.
      if (payload.customer.orderType === 'delivery' && !settings.deliveryEnabled) {
        return NextResponse.json({
          ok:false,code:'DELIVERY_UNAVAILABLE',
          error:'الدليفري مش متاح من الموقع حاليًا. اختار الاستلام من المطعم.',
        },{status:409,headers:{'Cache-Control':'no-store'}});
      }
      if (!settings.isOrderingOpen) {
        return NextResponse.json({ok:false,code:'ORDERING_CLOSED',
          error:'الطلبات متوقفة حاليًا. برجاء المحاولة لاحقًا.'},{status:409});
      }
      const key=typeof body.requestKey==='string'?body.requestKey:'';
      const saved=await submitOracleOrder(key,payload);
      return NextResponse.json({ok:true,orderId:saved.id,orderNumber:null,
        reference:'#'+saved.id.slice(0,8).toUpperCase(),tableReference:payload.tableReference,
        subtotal:saved.subtotal});
    }

    const settings = await getRuntimePublicSiteSettings();
    if (payload.customer.orderType === 'delivery' && !settings.deliveryEnabled) {
      return NextResponse.json({
        ok:false,code:'DELIVERY_UNAVAILABLE',
        error:'الدليفري مش متاح من الموقع حاليًا. اختار الاستلام من المطعم.',
      },{status:409,headers:{'Cache-Control':'no-store'}});
    }
    if (!settings.isOrderingOpen) {
      return NextResponse.json(
        {
          ok: false,
          code: 'ORDERING_CLOSED',
          error: 'الطلبات متوقفة حاليًا. برجاء المحاولة لاحقًا خلال مواعيد التشغيل.',
        },
        { status: 409 },
      );
    }

    // Verified ownership is only available after migration 009 was applied.
    // An anonymous guest can still order. Never trust a body-supplied user ID.
    let customerUserId: string | null = null;
    if (process.env.TUSCANINI_SUPABASE_CUSTOMER_ACCOUNTS_READY === 'yes') {
      try { customerUserId = await verifiedCustomerId(request); }
      catch {
        return NextResponse.json({ok:false,code:'INVALID_CUSTOMER_SESSION',
          error:'جلسة حسابك انتهت. جدّد تسجيل الدخول أو أكمل الطلب كضيف.'},
          {status:401,headers:{'Cache-Control':'no-store'}});
      }
    }
    const result = await createOrderInSupabase(payload, customerUserId);

    return NextResponse.json({
      ok: true,
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      reference: result.orderNumber ? `#${result.orderNumber}` : result.orderId,
      tableReference: result.tableReference,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'تعذر حفظ الطلب الآن.';
    if(error instanceof StudioMenuError || error instanceof OracleOrderError)return NextResponse.json({ok:false,error:message},{status:error.status});
    const isValidationError =
      message.includes('مطلوب') ||
      message.includes('غير صالح') ||
      message.includes('يجب') ||
      message.includes('السلة فارغة') ||
      message.includes('غير متطابق');

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: isValidationError ? 400 : 500 },
    );
  }
}

import { NextResponse } from 'next/server';

import { getPublicOrderTrackingOrThrow } from '@/lib/orders/track-order';
import { isLocalStudioRequest } from '@/lib/studio-bridge';
import { getStagedRebirthTracking, StudioMenuError } from '@/lib/studio-menu-orders';
import {oracleOrdersEnabled,trackOracleOrder,OracleOrderError} from '@/lib/oracle-order-api';

export async function GET(request: Request) {
  const headers = { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow, noarchive' };
  try {
    const requestUrl = new URL(request.url);
    const orderId = requestUrl.searchParams.get('orderId') ?? '';

    const tracking = isLocalStudioRequest(request) ? await getStagedRebirthTracking(orderId)
      : oracleOrdersEnabled() ? await trackOracleOrder(orderId)
      : await getPublicOrderTrackingOrThrow(orderId);

    return NextResponse.json({
      ok: true,
      order: {
        orderNumber: tracking.orderNumber,
        reference: tracking.reference,
        status: tracking.status,
        confirmationStatus: tracking.confirmationStatus,
        tableReference: tracking.tableReference,
        createdAt: tracking.createdAt,
        orderType: tracking.orderType,
        totalEstimate: tracking.totalEstimate,
      },
    }, { headers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'تعذر تحميل تتبع الطلب.';
    if(error instanceof StudioMenuError || error instanceof OracleOrderError)return NextResponse.json({ok:false,error:message},{status:error.status,headers});
    const isValidationError = message.includes('غير صالح');
    const isNotFound = message.includes('غير موجود');

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: isValidationError ? 400 : isNotFound ? 404 : 500, headers },
    );
  }
}

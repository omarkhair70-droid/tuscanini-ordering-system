import { NextResponse } from 'next/server';

import { createOrderInSupabase } from '@/lib/orders/create-order';
import { parseCreateOrderPayloadOrThrow } from '@/lib/orders/order-validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = parseCreateOrderPayloadOrThrow(body);
    const result = await createOrderInSupabase(payload);

    return NextResponse.json({
      ok: true,
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      reference: result.orderNumber ? `#${result.orderNumber}` : result.orderId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'تعذر حفظ الطلب الآن.';
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

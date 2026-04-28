import { NextResponse } from 'next/server';

import { getPublicOrderTrackingOrThrow } from '@/lib/orders/track-order';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const orderId = requestUrl.searchParams.get('orderId') ?? '';

    const tracking = await getPublicOrderTrackingOrThrow(orderId);

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
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'تعذر تحميل تتبع الطلب.';
    const isValidationError = message.includes('غير صالح');
    const isNotFound = message.includes('غير موجود');

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: isValidationError ? 400 : isNotFound ? 404 : 500 },
    );
  }
}

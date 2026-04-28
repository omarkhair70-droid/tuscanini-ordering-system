import { NextResponse } from 'next/server';

import { getSafeAdminNextPath } from '@/lib/admin/admin-auth';
import { parseOrderActionOrThrow, validateOrderIdOrThrow } from '@/lib/admin/orders-admin-validation';
import { applyAdminOrderActionOrThrow } from '@/lib/admin/orders-admin-writes';

function buildRedirectUrl(request: Request, fallbackPath: string, message: string, isError: boolean): URL {
  const requestUrl = new URL(request.url);
  const redirectTo = getSafeAdminNextPath(requestUrl.searchParams.get('returnTo') ?? fallbackPath);

  const redirectUrl = new URL(redirectTo, request.url);
  redirectUrl.searchParams.set(isError ? 'action_error' : 'action_success', message);
  return redirectUrl;
}

async function parseActionFromRequest(request: Request): Promise<string> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as { action?: unknown };
    return String(body.action ?? '');
  }

  const form = await request.formData();
  return String(form.get('action') ?? '');
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    validateOrderIdOrThrow(id);
    const actionValue = await parseActionFromRequest(request);
    const action = parseOrderActionOrThrow(actionValue);

    const result = await applyAdminOrderActionOrThrow(id, action);
    const reference = typeof result.orderNumber === 'number' ? `#${result.orderNumber}` : result.orderId;

    const successMessage =
      action === 'confirm'
        ? `تم تأكيد الطلب ${reference}.`
        : action === 'preparing'
          ? `تم تحويل الطلب ${reference} إلى جاري التحضير.`
          : action === 'ready'
            ? `تم تعليم الطلب ${reference} كجاهز.`
            : action === 'delivered'
              ? `تم تعليم الطلب ${reference} كتم التسليم.`
              : `تم إلغاء الطلب ${reference}.`;

    const redirectUrl = buildRedirectUrl(request, '/admin/orders', successMessage, false);

    return NextResponse.redirect(redirectUrl);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'تعذر تنفيذ الإجراء على الطلب.';
    const redirectUrl = buildRedirectUrl(request, '/admin/orders', message, true);

    return NextResponse.redirect(redirectUrl);
  }
}

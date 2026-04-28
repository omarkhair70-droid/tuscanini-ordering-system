import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  ADMIN_ACCESS_COOKIE_NAME,
  buildAdminSessionToken,
  getAdminSessionCookieConfig,
  getSafeAdminNextPath,
  isAdminSessionTokenValid,
  validateAdminAccessSecret,
} from '@/lib/admin/admin-auth';
import { PageHero } from '@/components/shared/page-hero';

type SearchParams = Record<string, string | string[] | undefined>;

function getParamValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

async function loginAction(formData: FormData) {
  'use server';

  const secretInput = String(formData.get('secret') ?? '');
  const nextInput = String(formData.get('next') ?? '');
  const nextPath = getSafeAdminNextPath(nextInput);

  const isSecretValid = await validateAdminAccessSecret(secretInput);
  if (!isSecretValid) {
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(nextPath)}`);
  }

  const sessionToken = await buildAdminSessionToken();
  if (!sessionToken) {
    redirect(`/admin/login?error=misconfigured&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_ACCESS_COOKIE_NAME,
    value: sessionToken,
    ...getAdminSessionCookieConfig(),
  });

  redirect(nextPath);
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const nextPath = getSafeAdminNextPath(getParamValue(resolvedSearchParams.next));
  const errorCode = getParamValue(resolvedSearchParams.error);

  const cookieStore = await cookies();
  const existingToken = cookieStore.get(ADMIN_ACCESS_COOKIE_NAME)?.value;
  const hasValidSession = await isAdminSessionTokenValid(existingToken);

  if (hasValidSession) {
    redirect(nextPath);
  }

  const errorMessage =
    errorCode === 'misconfigured'
      ? 'إعدادات الدخول غير مكتملة. تأكد من تعريف ADMIN_ACCESS_SECRET على الخادم.'
      : errorCode === 'invalid'
        ? 'الرمز السري غير صحيح. حاول مرة أخرى.'
        : '';

  return (
    <div className="space-y-6">
      <PageHero
        title="تسجيل دخول الإدارة"
        subtitle="دخول مؤقت عبر رمز سري محفوظ في متغيرات البيئة - بدون Supabase Auth حالياً."
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />

          <label className="block space-y-2 text-right">
            <span className="text-sm font-bold text-slate-700">رمز دخول الإدارة</span>
            <input
              type="password"
              name="secret"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-left outline-none ring-brand-red/30 transition focus:border-brand-red focus:ring"
              placeholder="ADMIN_ACCESS_SECRET"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            className="rounded-xl bg-brand-red px-4 py-2 text-sm font-black text-white transition hover:opacity-90"
          >
            دخول الإدارة
          </button>
        </form>
      </section>
    </div>
  );
}

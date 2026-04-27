'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { PageHero } from '@/components/shared/page-hero';
import { siteConfig } from '@/lib/site-config';

type ComplaintType = 'تأخير في الطلب' | 'مشكلة في الجودة' | 'مشكلة في الطلب' | 'سلوك الخدمة' | 'أخرى';

function normalizeWhatsappNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `20${digits.slice(1)}`;
  }
  return digits;
}

function buildComplaintMessage(params: {
  name: string;
  phone: string;
  complaintType: ComplaintType;
  message: string;
}) {
  const { name, phone, complaintType, message } = params;

  return [
    'مرحبًا توسكانيني 👋',
    'هذه شكوى من عميل، برجاء المتابعة:',
    '',
    '📌 *بيانات الشكوى*',
    `- الاسم: ${name || 'غير مذكور'}`,
    `- الهاتف: ${phone || 'غير مذكور'}`,
    `- نوع الشكوى: ${complaintType}`,
    `- التفاصيل: ${message}`,
    '',
    'شكرًا لتعاونكم.',
  ].join('\n');
}

export default function ComplaintsPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [complaintType, setComplaintType] = useState<ComplaintType>('تأخير في الطلب');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const whatsappUrl = useMemo(() => {
    const text = buildComplaintMessage({
      name: name.trim(),
      phone: phone.trim(),
      complaintType,
      message: message.trim(),
    });

    const phoneNumber = normalizeWhatsappNumber(siteConfig.whatsappOrderNumber);
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  }, [name, phone, complaintType, message]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!message.trim()) {
      setError('من فضلك اكتب تفاصيل الشكوى قبل الإرسال.');
      return;
    }

    setError('');
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="space-y-6">
      <PageHero title="الشكاوى" subtitle="اكتب شكوتك وسيتم إرسالها مباشرة عبر واتساب للمتابعة." />

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-brand-white p-5 shadow-punch">
        <div>
          <label htmlFor="complaint-name" className="mb-1 block text-sm font-bold">
            الاسم
          </label>
          <input
            id="complaint-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="اكتب اسمك"
            className="w-full rounded-xl border border-brand-charcoal/30 px-3 py-2 text-sm outline-none focus:border-brand-red"
          />
        </div>

        <div>
          <label htmlFor="complaint-phone" className="mb-1 block text-sm font-bold">
            الهاتف
          </label>
          <input
            id="complaint-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="اكتب رقم الهاتف"
            className="w-full rounded-xl border border-brand-charcoal/30 px-3 py-2 text-sm outline-none focus:border-brand-red"
          />
        </div>

        <div>
          <label htmlFor="complaint-type" className="mb-1 block text-sm font-bold">
            نوع الشكوى
          </label>
          <select
            id="complaint-type"
            value={complaintType}
            onChange={(event) => setComplaintType(event.target.value as ComplaintType)}
            className="w-full rounded-xl border border-brand-charcoal/30 bg-brand-white px-3 py-2 text-sm outline-none focus:border-brand-red"
          >
            <option>تأخير في الطلب</option>
            <option>مشكلة في الجودة</option>
            <option>مشكلة في الطلب</option>
            <option>سلوك الخدمة</option>
            <option>أخرى</option>
          </select>
        </div>

        <div>
          <label htmlFor="complaint-message" className="mb-1 block text-sm font-bold">
            تفاصيل الشكوى
          </label>
          <textarea
            id="complaint-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="اكتب تفاصيل الشكوى"
            rows={5}
            className="w-full rounded-xl border border-brand-charcoal/30 px-3 py-2 text-sm outline-none focus:border-brand-red"
          />
        </div>

        {error ? <p className="text-sm font-bold text-brand-red">{error}</p> : null}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="submit" className="btn-primary w-full sm:w-auto">
            إرسال الشكوى عبر واتساب
          </button>
          <Link href={whatsappUrl} target="_blank" className="btn-secondary w-full bg-brand-white sm:w-auto">
            معاينة رسالة واتساب
          </Link>
        </div>
      </form>
    </div>
  );
}

import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get('to') || 'mlbuilder10@gmail.com';

  const result = await sendEmail({
    to,
    subject: 'Hello World - Resend Test',
    html: '<p>Congrats on sending your <strong>first email</strong> from MLBuilder using Resend!</p>',
  });

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Test email sent successfully to ${to}!`,
    data: result.data,
  });
}

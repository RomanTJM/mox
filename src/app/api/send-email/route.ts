import { NextRequest, NextResponse } from 'next/server';
import mailgun from 'mailgun-js';

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY as string,
  domain: process.env.MAILGUN_DOMAIN as string,
});

export async function POST(req: NextRequest) {
  const { to, subject, text } = await req.json();

  const data = {
    from: `Booking Service <noreply@${process.env.MAILGUN_DOMAIN}>`,
    to,
    subject,
    text,
  };

  try {
    await mg.messages().send(data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
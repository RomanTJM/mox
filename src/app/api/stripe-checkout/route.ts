import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  const { venueId, venueName, price } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'rub',
            product_data: {
              name: `Бронирование: ${venueName}`,
            },
            unit_amount: price, 
          },
          quantity: 1,
        },
      ],
      success_url: `${req.nextUrl.origin}/venues/${venueId}?success=1`,
      cancel_url: `${req.nextUrl.origin}/venues/${venueId}?canceled=1`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 
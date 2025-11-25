import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const { name, email } = await req.json();

    // Create a Checkout session for the consultation hold
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      payment_intent_data: {
        capture_method: 'manual', // This creates a hold
        metadata: {
          customer_name: name,
          customer_email: email,
          type: 'consultation_hold',
        },
      },
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Consultation Booking Hold',
              description: 'Refundable $50 hold - deducted from final service price if you proceed',
            },
            unit_amount: 5000, // $50.00
          },
          quantity: 1,
        },
      ],
      success_url: `https://calendly.com/krish-raja/mindmaker-meeting?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&prefill_email=${encodeURIComponent(email)}&prefill_name=${encodeURIComponent(name)}`,
      cancel_url: `${req.headers.get('origin') || 'https://mindmaker.ai'}?booking_cancelled=true`,
      metadata: {
        customer_name: name,
        customer_email: email,
      },
    });

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});

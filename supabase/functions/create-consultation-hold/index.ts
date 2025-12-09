import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@18.5.0';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const consultationHoldSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  selectedProgram: z.string().max(100).optional(),
  priceId: z.string().max(100).optional(),
});

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Function invoked');
    
    // Check for Stripe key
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY not found');
      throw new Error('Stripe configuration missing');
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-08-27.basil',
    });

    const body = await req.json();
    
    // Validate input
    const parseResult = consultationHoldSchema.safeParse(body);
    if (!parseResult.success) {
      console.error("Validation failed:", parseResult.error.flatten());
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    const { name, email, selectedProgram, priceId } = parseResult.data;
    console.log('Request validated:', { name: '***', email: '***', selectedProgram });

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
          selected_program: selectedProgram || 'not-specified',
          program_price_id: priceId || 'not-specified',
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
      success_url: `https://calendly.com/krish-raja/mindmaker-meeting?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&prefill_email=${encodeURIComponent(email)}&prefill_name=${encodeURIComponent(name)}&a1=${encodeURIComponent(selectedProgram || 'not-specified')}`,
      cancel_url: `${req.headers.get('origin') || 'https://mindmaker.ai'}?booking_cancelled=true`,
      metadata: {
        customer_name: name,
        customer_email: email,
        selected_program: selectedProgram || 'not-specified',
        program_price_id: priceId || 'not-specified',
      },
    });

    console.log('Checkout session created successfully');
    
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
    // Log stack trace server-side only, don't expose to client
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});

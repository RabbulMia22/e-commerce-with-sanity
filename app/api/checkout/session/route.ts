import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil'
})

export async function POST(req: NextRequest) {
  try {
    console.log('Session retrieval API called');
    
    const { sessionId } = await req.json()
    console.log('Session ID received:', sessionId);

    if (!sessionId) {
      console.error('No session ID provided');
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not found');
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    // Retrieve the session from Stripe with metadata
    console.log('Retrieving Stripe session...');
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer', 'line_items']
    })

    console.log('Session retrieved successfully:', {
      id: session.id,
      status: session.payment_status,
      metadata: session.metadata
    });

    return NextResponse.json({
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email,
        customer_name: session.customer_details?.name,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_intent: session.payment_intent,
        customer: session.customer,
        line_items: session.line_items,
        metadata: session.metadata || {}
      }
    })
  } catch (error) {
    console.error('Error retrieving Stripe session:', error)
    
    let errorMessage = 'Failed to retrieve session details';
    let statusCode = 500;
    
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      
      if (error.message.includes('No such checkout session')) {
        errorMessage = 'Invalid session ID';
        statusCode = 404;
      } else if (error.message.includes('Invalid API key')) {
        errorMessage = 'Stripe configuration error';
        statusCode = 500;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: statusCode }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil'
})

// Simple GET handler for testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Checkout API is working',
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7)
  })
}

export async function POST(req: NextRequest) {
  try {
    console.log('Checkout API called');
    
    const body = await req.json()
    const { items, shippingInfo, successUrl, cancelUrl } = body
    
    console.log('Request body:', JSON.stringify(body, null, 2));

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not found');
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 })
    }

    if (!items || !items.length) {
      console.error('No items provided');
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    if (!shippingInfo) {
      console.error('No shipping info provided');
      return NextResponse.json({ error: 'Shipping information is required' }, { status: 400 })
    }

    // Validate required shipping fields
    if (!shippingInfo.fullName || !shippingInfo.phoneNumber || !shippingInfo.district || !shippingInfo.homeAddress) {
      console.error('Missing required shipping fields:', shippingInfo);
      return NextResponse.json({ error: 'All shipping fields are required' }, { status: 400 })
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      console.log('Processing item:', {
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        product: item.product
      });

      // Validate required fields
      if (!item.product.title) {
        throw new Error(`Product title is missing for item: ${JSON.stringify(item.product)}`);
      }
      
      if (!item.product.price || item.product.price <= 0) {
        throw new Error(`Invalid price for product ${item.product.title}: ${item.product.price}`);
      }
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.title,
            // Skip images for now to avoid URL issues
            images: [],
          },
          unit_amount: Math.round(item.product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    })

    console.log('Creating Stripe session with line items:', lineItems);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_creation: 'always',
      metadata: {
        // Store Bangladesh shipping info in metadata
        fullName: shippingInfo.fullName,
        phoneNumber: shippingInfo.phoneNumber,
        district: shippingInfo.district,
        homeAddress: shippingInfo.homeAddress.substring(0, 500), // Stripe metadata has character limits
        country: 'Bangladesh',
      },
      // Disable Stripe's built-in shipping collection since we're using custom form
      shipping_address_collection: undefined,
      phone_number_collection: {
        enabled: false
      },
    })

    console.log('Stripe session created successfully:', session.id);
    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating Stripe session:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create checkout session';
    let statusCode = 500;
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.message.includes('Invalid API key')) {
        errorMessage = 'Payment system configuration error';
      } else if (error.message.includes('price_data')) {
        errorMessage = 'Invalid product pricing data';
      } else if (error.message.includes('line_items')) {
        errorMessage = 'Invalid product information';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.message : 'Unknown error' },
      { status: statusCode }
    )
  }
}
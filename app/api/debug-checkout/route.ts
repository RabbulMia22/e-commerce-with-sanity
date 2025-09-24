import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    console.log('=== DEBUG CHECKOUT API ===');
    
    const body = await req.json()
    console.log('Full request body:', JSON.stringify(body, null, 2));
    
    const { items, shippingInfo, successUrl, cancelUrl } = body
    
    console.log('Items:', items);
    console.log('Shipping info:', shippingInfo);
    console.log('Success URL:', successUrl);
    console.log('Cancel URL:', cancelUrl);
    
    // Check each item
    if (items && Array.isArray(items)) {
      items.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          productId: item.product?._id,
          productTitle: item.product?.title,
          productPrice: item.product?.price,
          quantity: item.quantity,
          fullProduct: item.product
        });
      });
    }
    
    // Return success for debugging
    return NextResponse.json({ 
      success: true, 
      message: 'Debug API - Check server logs for detailed information',
      receivedItemsCount: items?.length || 0,
      hasShippingInfo: !!shippingInfo
    })
    
  } catch (error) {
    console.error('Debug API Error:', error)
    return NextResponse.json(
      { 
        error: 'Debug API Error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : null
      },
      { status: 500 }
    )
  }
}
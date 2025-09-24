import { NextRequest, NextResponse } from 'next/server'
import { saveOrderToSanity } from '@/lib/orders'

export async function POST(req: NextRequest) {
  try {
    const { orderData, basketItems } = await req.json()

    if (!orderData || !basketItems) {
      return NextResponse.json({ error: 'Order data and basket items are required' }, { status: 400 })
    }

    // Save order to Sanity
    const savedOrder = await saveOrderToSanity(orderData, basketItems)

    return NextResponse.json({ 
      success: true, 
      order: savedOrder,
      message: 'Order saved to Sanity successfully' 
    })
  } catch (error) {
    console.error('Error saving order:', error)
    return NextResponse.json(
      { error: 'Failed to save order to Sanity' },
      { status: 500 }
    )
  }
}
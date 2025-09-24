import { writeClient } from '@/sanity/lib/backendClient'
import { BasketItem } from '@/store/store'

export interface ShippingAddress {
  fullName: string
  phoneNumber: string
  district: string
  homeAddress: string
  country: string
}

export interface OrderData {
  orderNumber: string
  stripeSessionId: string
  stripeCustomerId?: string
  total: number
  customerName: string
  email: string
  stripePaymentIntentId?: string
  products: Array<{
    product: {
      _type: 'reference'
      _ref: string
    }
    quantity: number
  }>
  totalPrice: number
  currency: string
  amountDiscount?: number
  status: string
  orderDate: string
  shippingAddress?: ShippingAddress
  deliveryStatus?: string
  deliveryNotes?: string
}

export async function saveOrderToSanity(
  orderData: Omit<OrderData, 'orderDate'>,
  basketItems: BasketItem[]
): Promise<any> {
  try {
    console.log('Attempting to save order to Sanity with token:', process.env.SANITY_API_TOKEN ? 'Token exists' : 'No token');
    
    // Create the order document
    const orderDoc = {
      _type: 'order',
      orderNumber: orderData.orderNumber,
      stripeSessionId: orderData.stripeSessionId,
      stripeCustomerId: orderData.stripeCustomerId,
      total: orderData.total,
      customerName: orderData.customerName,
      email: orderData.email,
      stripePaymentIntentId: orderData.stripePaymentIntentId,
      products: basketItems.map(item => ({
        _type: 'object',
        product: {
          _type: 'reference',
          _ref: item.product._id
        },
        quantity: item.quantity
      })),
      totalPrice: orderData.totalPrice,
      currency: orderData.currency,
      amountDiscount: orderData.amountDiscount || 0,
      status: orderData.status,
      orderDate: new Date().toISOString(),
      shippingAddress: orderData.shippingAddress ? {
        _type: 'object',
        fullName: orderData.shippingAddress.fullName,
        phoneNumber: orderData.shippingAddress.phoneNumber,
        district: orderData.shippingAddress.district,
        homeAddress: orderData.shippingAddress.homeAddress,
        country: orderData.shippingAddress.country,
      } : undefined,
      deliveryStatus: orderData.deliveryStatus || 'confirmed',
      deliveryNotes: orderData.deliveryNotes,
    };

    console.log('Order document to save:', JSON.stringify(orderDoc, null, 2));
    
    const order = await writeClient.create(orderDoc);

    console.log('Order saved to Sanity successfully:', order)
    return order
  } catch (error) {
    console.error('Error saving order to Sanity:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    throw error
  }
}

// Function to get Stripe session details
export async function getStripeSessionDetails(sessionId: string) {
  try {
    console.log('Getting Stripe session details for:', sessionId);
    
    const response = await fetch('/api/checkout/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId })
    })

    console.log('Session API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Session API error:', errorData);
      throw new Error(`Failed to get session details: ${errorData.error || response.statusText}`)
    }

    const data = await response.json()
    console.log('Session details retrieved successfully');
    return data
  } catch (error) {
    console.error('Error getting Stripe session:', error)
    throw error // Re-throw instead of returning null to handle errors properly
  }
}
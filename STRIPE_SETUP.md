# Stripe Payment Integration Setup Guide

## 🔧 Setup Instructions

### 1. Get Your Stripe API Keys

1. **Sign up/Login to Stripe:**
   - Go to https://dashboard.stripe.com
   - Create an account or log in

2. **Get API Keys:**
   - Navigate to **Developers > API keys**
   - Copy the **Publishable key** (starts with `pk_test_`)
   - Copy the **Secret key** (starts with `sk_test_`)

### 2. Update Environment Variables

Replace the placeholder keys in your `.env.local` file:

```bash
# Replace these with your actual Stripe keys
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

### 3. Test the Payment Flow

1. **Add items to basket** - Browse products and add them to your cart
2. **Go to basket** - Click "My Basket" in the header
3. **Sign in** - Use Clerk authentication
4. **Click "Proceed to Checkout"** - This will redirect to Stripe
5. **Use test card numbers:**
   - **Success:** `4242 4242 4242 4242`
   - **Decline:** `4000 0000 0000 0002`
   - **Expiry:** Any future date
   - **CVC:** Any 3 digits

## 🛒 How the Payment System Works

### Payment Flow:
```
Basket → Sign In → Stripe Checkout → Success/Cancel Page
```

### Key Components:

1. **createSessionCheckout.ts** - Creates Stripe checkout session
2. **Basket Page** - Integrates with Stripe checkout
3. **Success Page** - Post-payment confirmation
4. **Cancel Page** - Payment cancellation handling

## 🔒 Security Features

- ✅ **Server-side payment processing**
- ✅ **User authentication required**
- ✅ **Automatic basket clearing on success**
- ✅ **Error handling and validation**
- ✅ **Secure Stripe integration**

## 📧 Order Management

- Orders are tracked with unique IDs
- Customer information is stored in Stripe
- Metadata includes Clerk user ID for tracking
- Email confirmations sent automatically by Stripe

## 🎨 User Experience Features

- **Loading states** during checkout
- **Disabled button** when not signed in
- **Error messages** for failed payments
- **Success celebration** with order details
- **Basket preservation** on cancellation

## 🧪 Testing

### Test Credit Cards:
- **Visa:** 4242 4242 4242 4242
- **Visa (debit):** 4000 0560 0000 0004
- **Mastercard:** 5555 5555 5555 4444
- **American Express:** 3782 822463 10005
- **Declined:** 4000 0000 0000 0002

### Test Scenarios:
1. ✅ Successful payment
2. ❌ Declined payment
3. 🚫 User cancellation
4. 🔄 Multiple items in basket
5. 💰 Different price points

## 🚀 Going Live

When ready for production:
1. Replace test keys with live keys
2. Update `NEXT_PUBLIC_BASE_URL` to your domain
3. Test with real (small amount) transactions
4. Set up webhooks for order fulfillment

## 📞 Support

If you encounter issues:
- Check Stripe dashboard for payment logs
- Verify environment variables are set
- Ensure user is signed in before checkout
- Check browser console for errors
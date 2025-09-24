import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    'STRIPE_SECRET_KEY is not set. Please add your Stripe secret key to .env.local file. Get your keys from: https://dashboard.stripe.com/apikeys'
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

export default stripe;
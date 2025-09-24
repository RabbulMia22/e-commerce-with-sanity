// Test script to check environment variables and URLs
console.log('=== ENVIRONMENT CHECK ===');
console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Expected success URL:', `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`);
console.log('Expected cancel URL:', `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/cancel`);

// Check if Stripe keys are available
console.log('=== STRIPE CHECK ===');
console.log('STRIPE_SECRET_KEY present:', !!process.env.STRIPE_SECRET_KEY);
console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY present:', !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

console.log('=== TEST COMPLETE ===');
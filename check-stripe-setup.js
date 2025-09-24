#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Stripe Setup Helper');
console.log('=====================\n');

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found!');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');

// Check if Stripe keys are set up
const hasRealStripeKey = envContent.includes('sk_test_') && 
                        !envContent.includes('your_stripe_secret_key_here') &&
                        !envContent.includes('51OeFRKElgKJxVGOeFRK');

if (hasRealStripeKey) {
    console.log('✅ Stripe keys are configured!');
    console.log('✅ You can test payments with these test cards:');
    console.log('   💳 Success: 4242 4242 4242 4242');
    console.log('   ❌ Decline: 4000 0000 0000 0002');
    console.log('   📅 Expiry: Any future date');
    console.log('   🔒 CVC: Any 3 digits\n');
} else {
    console.log('⚠️  Stripe keys need to be configured!\n');
    console.log('📋 Steps to set up Stripe:');
    console.log('1. Go to https://dashboard.stripe.com');
    console.log('2. Create an account or log in');
    console.log('3. Navigate to "Developers" > "API keys"');
    console.log('4. Copy the "Publishable key" (starts with pk_test_)');
    console.log('5. Copy the "Secret key" (starts with sk_test_)');
    console.log('6. Replace the values in .env.local file\n');
    
    console.log('🔗 Quick links:');
    console.log('   Stripe Dashboard: https://dashboard.stripe.com');
    console.log('   API Keys: https://dashboard.stripe.com/apikeys');
    console.log('   Test Cards: https://stripe.com/docs/testing#cards\n');
}

console.log('🚀 To test the payment flow:');
console.log('1. Start your app: npm run dev');
console.log('2. Add items to your basket');
console.log('3. Sign in with Clerk');
console.log('4. Click "Proceed to Checkout"');
console.log('5. Use test card numbers above\n');

console.log('💡 Need help? Check STRIPE_SETUP.md for detailed instructions.');
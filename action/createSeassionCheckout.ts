"use server"

import stripe from "@/lib/stripe";
import { BasketItem } from "@/store/store";
import { imageUrl } from "@/sanity/lib/imageUrl";

export type MetaData = {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    clerkUserId: string;
};
export type GroupBasketItem = {
    product: BasketItem['product'];
    quantity: number;
};

export async function createSessionCheckout(
    items: BasketItem[],
    metaData: MetaData,
    baseUrl?: string
){
    try {
        // Validate items have prices
        const itemsWithoutPrice = items.filter((item) => !item.product.price);
        if(itemsWithoutPrice.length > 0){
            throw new Error("One or more items are missing a price");
        }

        // Check for existing customer
        const customer = await stripe.customers.list({
            email: metaData.customerEmail,
            limit: 1
        });

        let customerId: string | undefined;
        if (customer.data.length > 0) {
            customerId = customer.data[0].id;
        }

        // Create line items for Stripe with enhanced product information
        const line_items = items.map((item) => {
            // Handle Sanity image URL
            const imageUrls = item.product.image 
                ? [imageUrl(item.product.image).width(400).height(400).url()]
                : [];

            // Extract text from description blocks
            const description = Array.isArray(item.product.description) 
                ? item.product.description
                    .map(block => 
                        block.children?.map(child => child.text).join('') || ''
                    )
                    .join(' ')
                    .substring(0, 300) // Limit description length
                : 'High quality product';

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.product.title || 'Product',
                        description: description || 'High quality product',
                        images: imageUrls,
                        metadata: {
                            productId: item.product._id || '',
                            slug: item.product.slug?.current || '',
                            gender: item.product.gender || '',
                        }
                    },
                    unit_amount: Math.round((item.product.price || 0) * 100), // Convert to cents
                },
                quantity: item.quantity,
            };
        });

        // Create checkout session with enhanced product display
        const currentBaseUrl = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        
        console.log('Creating Stripe session with base URL:', currentBaseUrl);
        console.log('Success URL will be:', `${currentBaseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
        
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            customer_creation: customerId ? undefined : 'always',
            customer_email: !customerId ? metaData.customerEmail : undefined,
            metadata: metaData,
            mode: 'payment',
            allow_promotion_codes: true,
            line_items,
            success_url: `${currentBaseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${currentBaseUrl}/checkout/cancel`,
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK', 'BD'],
            },
            payment_method_types: ['card'],
            invoice_creation: {
                enabled: true,
            }
        });

        console.log('Stripe session created successfully:', session.id);
        console.log('Checkout URL:', session.url);

        return {
            url: session.url,
            sessionId: session.id
        };

    } catch (error) {
        console.error("Error creating checkout session:", error);
        throw new Error("Failed to create checkout session");
    }
}
import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderTypes = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stripeSessionId",
      title: "Stripe Session ID",
      type: "string",
    }),
    defineField({
      name: "stripeCustomerId",
      title: "Stripe Customer ID",
      type: "string",
    }),
    defineField({
      name: "total",
      title: "Total",
      type: "number",
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "Stripe Payment Intent ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.min(1).required(),
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              price: "product.price",
              image: "product.image",
              currency: "product.currency",
            },
            prepare(select) {
              return {
                title: `${select.product} × ${select.quantity}`,
                subtitle: `${(select.price * (select.quantity || 1)).toFixed(2)} ${select.currency}`,
                media: select.image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
        name: "totalPrice",
        title: "Total Price",
        type: "number",
        validation: (Rule) => Rule.min(0),
    }),
    defineField({
        name: "currency",
        title: "Currency",
        type: "string",
        validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: "amountDiscount",
        title: "Amount Discount",
        type: "number",
        validation: (Rule) => Rule.min(0),
    }),
    defineField({
        name: "status",
        title: "Status",
        type: "string",
        options: {
            list: [
                { title: "Pending", value: "pending" },
                { title: "Paid", value: "paid" },
                { title: "Shipped", value: "shipped" },
                { title: "Delivered", value: "delivered" },
                { title: "Cancelled", value: "cancelled" },
            ],
        },
    }),
    defineField({
        name: "orderDate",
        title: "Order Date",
        type: "datetime",
        validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
  select: {
    orderNumber: "orderNumber",
    customerName: "customerName",
    totalPrice: "totalPrice",
    currency: "currency",
    email: "email",
  },
  prepare(select) {
    const orderIdSnippet = `${select.orderNumber.slice(0, 5)}...${select.orderNumber.slice(-5)}`;
    return {
      title: `${select.customerName} (${orderIdSnippet})`,
      subtitle: `${select.totalPrice ?? 0} ${select.currency}, ${select.email}`,
      media: BasketIcon,
    };
  },
},
});

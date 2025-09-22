import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
    name: 'product',
    title: 'Product',
    icon: TrolleyIcon,
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'gender',
            title: 'Gender',
            type: 'string',
            options: {
            list: [
                { title: "Male", value: "male" },
                { title: "Female", value: "female" },
                { title: "Kids", value: "kids" },
                { title: "Both Male & Female", value: "both male & female" },
            ],
        },
        }),
        
        defineField({
            name: 'category',
            title: 'Category',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'category' } }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'stock',
            title: 'Stock',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'image',
            subtitle: 'price',
        },
        prepare(selection) {
            const { title, media, subtitle } = selection;
            return {
                title: title,
                media: media,
                subtitle: `$${subtitle}`,
            };
        },
    },
});
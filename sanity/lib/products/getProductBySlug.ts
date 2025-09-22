import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductBySlug = async (slug: string) => {
    const PRODUCT_BY_SLUG_QUERY = defineQuery(`
    *[_type == "product" && slug.current == $slug][0] {
        _id,
        _createdAt,
        _updatedAt,
        title,
        slug,
        image,
        description,
        price,
        category->{
            _id,
            title
        },
        stock,
        gender
    }`);
    
    try {
        const product = await sanityFetch({
            query: PRODUCT_BY_SLUG_QUERY,
            params: { slug }
        });
        return product.data || null;
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        return null;
    }
};
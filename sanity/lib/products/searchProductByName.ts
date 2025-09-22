import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const searchProductByName = async (searchParam: string) => {
    const PRODUCT_SEARCH_QUERY = defineQuery(`
    *[_type == "product" 
    && (title match $searchParam 
        || pt::text(description) match $searchParam)
    ] | order(title asc)`);
    try {
        const products = await sanityFetch({
            query: PRODUCT_SEARCH_QUERY, 
            params: {
                searchParam: `*${searchParam}*`
            }
        });
        console.log("Search results for:", searchParam, "Found:", products.data?.length || 0);
        return products.data || [];
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
};
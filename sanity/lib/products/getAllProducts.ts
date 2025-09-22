import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { client } from "../client";

export const getAllProducts = async () => {
    const ALL_PRODUCTS_QUERY = defineQuery(`*[_type == "product"] | order(name asc)`);
    try {
        const products = await sanityFetch({ query: ALL_PRODUCTS_QUERY });
        return products.data || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

// Static version for build-time generation (e.g., generateStaticParams)
export const getAllProductsStatic = async () => {
    const ALL_PRODUCTS_QUERY = `*[_type == "product"] | order(name asc)`;
    try {
        const products = await client.fetch(ALL_PRODUCTS_QUERY);
        return products || [];
    } catch (error) {
        console.error("Error fetching products (static):", error);
        return [];
    }
};
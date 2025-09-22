import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { CoupponCode } from "./coupponCode";

export const getCouponCode = async (coupponCode: CoupponCode) => {
 
  const ACTIVE_SALE_BY_COUPON_QUERY = defineQuery(`
    *[
        _type == "sales" 
        && isActive == true 
        && couponCode == $coupponCode
        ] | order(validUntil desc)[0]
  `);
  try {
        console.log("Searching for coupon code:", coupponCode);
        const activatedSale = await sanityFetch({
            query: ACTIVE_SALE_BY_COUPON_QUERY,
            params: { coupponCode },
        });
        
        return activatedSale ? activatedSale.data : null;
    } catch (error) {
        console.error("Error fetching coupon code:", error);
        return null;
    }
};
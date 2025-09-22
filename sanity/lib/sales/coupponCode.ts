export const COUPON_CODE ={
    SSUNDAY: "SSUNDAY",
    XMAS2021: "XMAS2021",
    NEWYEAR2024: "NEWYEAR2024",
} as const;
export type CoupponCode = typeof COUPON_CODE[keyof typeof COUPON_CODE];
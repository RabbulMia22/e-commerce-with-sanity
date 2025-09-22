import { Product } from "@/sanity.types";
import { imageUrl } from "@/sanity/lib/imageUrl";
import Image from "next/image";
import Link from "next/link";

function ProductThumbnail({ product }: { product: Product }) {
  const isOutOfStock = (product.stock ?? 0) <= 0;

  return (
    <Link
      href={`/product/${product.slug.current}`}
      className={`group relative border rounded-xl shadow-sm overflow-hidden bg-white hover:shadow-xl transition-all duration-300 block w-72 mx-auto ${
        isOutOfStock ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {/* Image */}
      <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
        {product.image && (
          <Image
            src={imageUrl(product.image).url()}
            alt={product.title || "Product Image"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-white font-bold text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 text-left">
        <h2 className="text-base font-semibold text-gray-800 truncate">
          {product.title ?? "Product"}
        </h2>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
          {product.description
            ?.map((block) =>
              block.children.map((child) => child.text).join(" ")
            )
            .join(" ") || "No description available."}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">
            ${product.price ?? "—"}
          </span>
          <button
            className="rounded-md bg-indigo-600 text-white px-3 py-1 text-sm font-medium hover:bg-indigo-700 transition-colors duration-300"
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "N/A" : "View"}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductThumbnail;

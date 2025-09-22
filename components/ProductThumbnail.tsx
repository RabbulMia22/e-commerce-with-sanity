import { Product } from "@/sanity.types";
import { imageUrl } from "@/sanity/lib/imageUrl";
import Image from "next/image";
import Link from "next/link";

function ProductThumbnail({ product }: { product: Product }) {
  const isOutOfStock = (product.stock ?? 0) <= 0;

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className={`group relative border rounded-xl shadow-sm overflow-hidden bg-white hover:shadow-xl transition-all duration-300 w-full flex flex-col h-[420px]  ${
        isOutOfStock ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {/* Image */}
      <div className="relative w-full h-48 sm:h-52 md:h-56 lg:h-80 bg-gray-100 overflow-hidden flex-shrink-0">
        {product.image ? (
          <Image
            src={imageUrl(product.image).url()}
            alt={product.title || "Product Image"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 "
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-gray-400 text-4xl">📦</div>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-white font-bold text-xs sm:text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 text-left flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
            {product.title ?? "Product"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2 h-10 overflow-hidden">
            {product.description
              ?.map((block) =>
                block?.children?.map((child) => child.text).join(" ")
              )
              .join(" ") || "No description available."}
          </p>
        </div>

        <div className="mt-3 sm:mt-4 flex items-center justify-between">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            ${product.price ?? "—"}
          </span>
          <button
            className="rounded-md bg-indigo-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

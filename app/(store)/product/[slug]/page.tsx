import { getProductBySlug } from '@/sanity/lib/products/getProductBySlug';
import { getAllProducts, getAllProductsStatic } from '@/sanity/lib/products/getAllProducts';
import { imageUrl } from '@/sanity/lib/imageUrl';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShoppingCart, Heart, Share, ArrowLeft, Star, Shield, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import ProductInteractions from '@/components/ProductInteractions';
import { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for better performance
export async function generateStaticParams() {
  const products = await getAllProductsStatic();
  
  return products.map((product) => ({
    slug: product.slug?.current || '',
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for could not be found.',
    };
  }

  const description = product.description?.map((block: any) => 
    block.children?.map((child: any) => child.text).join(' ')
  ).join(' ').slice(0, 160) || `Buy ${product.title} at the best price. High-quality products with fast shipping.`;

  return {
    title: `${product.title} - Premium E-Commerce Store`,
    description,
    keywords: [
      product.title || '',
      product.category?.title || '',
      product.gender || '',
      'e-commerce',
      'online shopping',
      'premium quality'
    ].filter(Boolean),
    openGraph: {
      title: product.title || 'Premium Product',
      description,
      images: product.image ? [
        {
          url: imageUrl(product.image).url(),
          width: 800,
          height: 800,
          alt: product.title || 'Product Image',
        }
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title || 'Premium Product',
      description,
      images: product.image ? [imageUrl(product.image).url()] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

async function ProductPage({params}: ProductPageProps) {
    const {slug} = await params;
    const product = await getProductBySlug(slug);
    
    if (!product) {
        notFound();
    }

    // Get related products
    const allProducts = await getAllProducts();
    const relatedProducts = allProducts
        .filter(p => p._id !== product._id)
        .slice(0, 4);

    const isOutOfStock = (product.stock ?? 0) <= 0;
    const stockLevel = product.stock ?? 0;
    const stockStatus = stockLevel > 10 ? 'In Stock' : stockLevel > 0 ? 'Low Stock' : 'Out of Stock';
    const stockColor = stockLevel > 10 ? 'text-emerald-600' : stockLevel > 0 ? 'text-amber-600' : 'text-red-600';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Navigation Breadcrumb */}
            <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <nav className="flex items-center space-x-2 text-sm">
                            <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                                Home
                            </Link>
                            <span className="text-gray-400">/</span>
                            <Link href="/search" className="text-gray-500 hover:text-blue-600 transition-colors">
                                Products
                            </Link>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-900 font-medium truncate max-w-xs">
                                {product.title}
                            </span>
                        </nav>
                        
                        <Link 
                            href="/search"
                            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Product Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Product Image Section */}
                        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 lg:p-12">
                            <div className="relative aspect-square bg-white rounded-xl shadow-lg overflow-hidden group">
                                {product.image ? (
                                    <Image
                                        src={imageUrl(product.image).url()}
                                        alt={product.title || "Product Image"}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <div className="text-center">
                                            <div className="text-gray-400 text-8xl mb-4">📦</div>
                                            <p className="text-gray-500 text-lg">No image available</p>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Status Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {isOutOfStock && (
                                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                            Out of Stock
                                        </span>
                                    )}
                                    {stockLevel > 0 && stockLevel <= 5 && (
                                        <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                            Only {stockLevel} left!
                                        </span>
                                    )}
                                </div>

                                {/* Rating Badge */}
                                <div className="absolute top-4 right-4">
                                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-semibold">4.8</span>
                                    </div>
                                </div>
                            </div>

                            {/* Image Thumbnails (Placeholder) */}
                            <div className="grid grid-cols-4 gap-3 mt-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="aspect-square bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors cursor-pointer opacity-60 hover:opacity-100">
                                        <div className="w-full h-full bg-gray-100 rounded-lg"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Details Section */}
                        <div className="p-8 lg:p-12 space-y-8">
                            {/* Header */}
                            <div className="space-y-4">
                                {product.category && (
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {product.category.title}
                                        </span>
                                        {product.gender && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {product.gender}
                                            </span>
                                        )}
                                    </div>
                                )}
                                
                                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                                    {product.title}
                                </h1>
                                
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                                        ))}
                                        <span className="text-gray-600 ml-2">(128 reviews)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-4xl font-bold text-gray-900">
                                            ${product.price?.toFixed(2) || '0.00'}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Free shipping • Tax included
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-semibold ${stockColor}`}>
                                            {stockStatus}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {stockLevel > 0 ? `${stockLevel} available` : 'Notify when available'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity & Actions */}
                            <ProductInteractions 
                                product={product}
                                isOutOfStock={isOutOfStock}
                                stockLevel={stockLevel}
                            />

                            {/* Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-green-800">Free Shipping</p>
                                        <p className="text-sm text-green-600">On orders over $50</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <RotateCcw className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-blue-800">Easy Returns</p>
                                        <p className="text-sm text-blue-600">30-day policy</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-purple-800">Warranty</p>
                                        <p className="text-sm text-purple-600">1-year coverage</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                        <Star className="w-5 h-5 text-amber-600 fill-current" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-amber-800">Premium Quality</p>
                                        <p className="text-sm text-amber-600">Certified materials</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Description */}
                <div className="mt-12 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8 lg:p-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Product Description</h2>
                        <div className="prose prose-lg max-w-none">
                            {product.description && product.description.length > 0 ? (
                                product.description.map((block: any, index: number) => (
                                    <p key={index} className="text-gray-700 leading-relaxed mb-4 text-lg">
                                        {block.children?.map((child: any) => child.text).join(' ')}
                                    </p>
                                ))
                            ) : (
                                <p className="text-gray-500 italic text-lg">
                                    No description available for this product.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">You Might Also Like</h2>
                            <p className="text-gray-600 text-lg">Similar products from our collection</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <ProductGrid products={relatedProducts} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductPage;
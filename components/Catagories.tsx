"use client"

import { Product } from '@/sanity.types'
import React, { useState, useEffect, useCallback } from 'react'
import ProductThumbnail from './ProductThumbnail'

interface CategoriesProps {
  products: Product[];
  onFilterChange?: (filteredProducts: Product[]) => void;
  onResetFilters?: () => void;
}

function Catagories({products, onFilterChange, onResetFilters}: CategoriesProps) {
    const [selectedGender, setSelectedGender] = useState<string>("");

    // Gender options with proper mapping to database values
    const genderOptions = [
       { label: "Male", value: "male" },
       { label: "Female", value: "female" },
       { label: "Kids", value: "kids" },
       { label: "Both Male & Female", value: "both male & female" },

    ];

    // Memoize the filter function to prevent unnecessary re-renders
    const filterProducts = useCallback((gender: string) => {
        const filteredProducts = gender === "" 
            ? products  // Show all products by default
            : products.filter(product => {
                // Filter based on gender selection
                if (gender === "male") {
                    return product.gender === "male" || product.gender === "both male & female";
                } else if (gender === "female") {
                    return product.gender === "female" || product.gender === "both male & female";
                } else if (gender === "kids") {
                    return product.gender === "kids";
                } else if (gender === "both male & female") {
                    return product.gender === "both male & female";
                }
                return false;
            });
        return filteredProducts;
    }, [products]);

    const handleGenderChange = (gender: string) => {
        // Toggle the gender filter - if already selected, deselect it
        const newSelectedGender = selectedGender === gender ? "" : gender;
        setSelectedGender(newSelectedGender);
        
        // Immediately filter and notify parent
        const filteredProducts = filterProducts(newSelectedGender);
        if (onFilterChange) {
            onFilterChange(filteredProducts);
        }
    };

    // Only run on initial load or when products change
    useEffect(() => {
        // Initial filter when component mounts or products change
        const filteredProducts = filterProducts(selectedGender);
        if (onFilterChange) {
            onFilterChange(filteredProducts);
        }
    }, [products]); // Only depend on products, not onFilterChange

    // Get current filtered products for display
    const filteredProducts = filterProducts(selectedGender);

    return (
        <div className="space-y-6">
            {/* Gender Filter */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="text-md font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">
                    <span className="flex items-center gap-2">
                        🔍 Filter by Gender
                    </span>
                </h4>
                <div className="space-y-2">
                    {genderOptions.map(gender => (
                        <label key={gender.value} className="flex items-center space-x-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-colors"
                                checked={selectedGender === gender.value}
                                onChange={() => handleGenderChange(gender.value)}
                            />
                            <span className="text-gray-700 group-hover:text-gray-900 transition-colors font-medium">
                                {gender.label}
                            </span>
                        </label>
                    ))}
                </div>
                
                {/* Clear Filter Button */}
                {selectedGender && (
                    <button 
                        onClick={() => {
                            setSelectedGender("");
                            if (onFilterChange) {
                                onFilterChange(products); 
                            }
                        }}
                        className="mt-3 w-full text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        ✕ Clear filter
                    </button>
                )}
            </div>

            {/* Filter Results Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                    <span className="font-semibold">{filteredProducts.length}</span> of{' '}
                    <span className="font-semibold">{products.length}</span> products
                    {selectedGender && (
                        <span className="block text-xs mt-1">
                            Filtered by: {genderOptions.find(g => g.value === selectedGender)?.label}
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
}

export default Catagories;
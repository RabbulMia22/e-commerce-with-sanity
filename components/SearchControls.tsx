"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterIcon, SortIcon } from '@sanity/icons';
import { useState, useCallback } from 'react';

interface SearchControlsProps {
  currentSort?: string;
  currentCategory?: string;
  totalResults: number;
}

export function SearchControls({ currentSort, currentCategory, totalResults }: SearchControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const updateSearchParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  }, [router, searchParams]);

  const handleSortChange = (sort: string) => {
    updateSearchParams('sort', sort);
  };

  const handleCategoryChange = (category: string) => {
    updateSearchParams('category', category);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Results Count */}
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{totalResults}</span> result{totalResults !== 1 ? 's' : ''}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4 text-gray-500" />
            <select 
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={currentCategory || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home & Garden</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SortIcon className="w-4 h-4 text-gray-500" />
            <select 
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={currentSort || ''}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="">Relevance</option>
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(currentSort || currentCategory) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {currentCategory && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Category: {currentCategory}
                <button
                  onClick={() => handleCategoryChange('')}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                >
                  ×
                </button>
              </span>
            )}
            {currentSort && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Sort: {currentSort}
                <button
                  onClick={() => handleSortChange('')}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                handleSortChange('');
                handleCategoryChange('');
              }}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchControls;
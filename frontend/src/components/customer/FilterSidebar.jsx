import React, { useState } from 'react';
import { PRODUCT_TYPES, PRODUCT_SEX } from '../../utils/constants';

const FilterSidebar = ({ onFilterChange, filters }) => {
  const [priceRange, setPriceRange] = useState({
    min: filters.min_price || '',
    max: filters.max_price || ''
  });

  const handleTypeChange = (type) => {
    onFilterChange({ ...filters, product_type: type === filters.product_type ? '' : type });
  };

  const handleSexChange = (sex) => {
    onFilterChange({ ...filters, product_sex: sex === filters.product_sex ? '' : sex });
  };

  const handlePriceChange = () => {
    onFilterChange({
      ...filters,
      min_price: priceRange.min,
      max_price: priceRange.max
    });
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700">
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Category</h4>
        <div className="space-y-2">
          {PRODUCT_TYPES.map((type) => (
            <label key={type} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.product_type === type}
                onChange={() => handleTypeChange(type)}
                className="mr-2"
              />
              <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Gender</h4>
        <div className="space-y-2">
          {PRODUCT_SEX.map((sex) => (
            <label key={sex} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.product_sex === sex}
                onChange={() => handleSexChange(sex)}
                className="mr-2"
              />
              <span className="text-sm capitalize">{sex}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min Price"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handlePriceChange}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
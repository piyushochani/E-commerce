import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/customer/products?category=${category.value}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer">
        <div className="text-4xl mb-4">{category.icon}</div>
        <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
        <p className="text-gray-600 text-sm">{category.description}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
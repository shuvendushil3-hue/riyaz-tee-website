import React from 'react';
import { Link } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group" data-testid={`product-card-${product.id}`}>
      <div className="relative overflow-hidden bg-[#171717] aspect-[4/5]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          data-testid={`product-image-${product.id}`}
        />
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-bold text-base text-neutral-100" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-yellow-400 font-bold text-lg" data-testid={`product-price-${product.id}`}>
          ₹{product.price}
        </p>
      </div>
    </Link>
  );
};

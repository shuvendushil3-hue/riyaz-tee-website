import React from 'react';
import { Link } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group" data-testid={`product-card-${product.id}`}>
      <div className="relative overflow-hidden bg-[#171717] aspect-[4/5] rounded-3xl mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          data-testid={`product-image-${product.id}`}
        />
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-green-500/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">
            {Math.round(((product.price * 1.4 - product.price) / (product.price * 1.4)) * 100)}% OFF
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-lg text-neutral-100 group-hover:text-yellow-400 transition-colors line-clamp-2" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <p className="text-yellow-400 font-bold text-xl" data-testid={`product-price-${product.id}`}>
            ₹{product.price}
          </p>
          <p className="text-neutral-500 text-sm line-through">₹{Math.round(product.price * 1.4)}</p>
        </div>
      </div>
    </Link>
  );
};

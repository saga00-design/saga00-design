import React from 'react';
import { Product } from '../types';
import { Info } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  fontClass: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, fontClass }) => {
  return (
    <div 
      className="group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-white/5"
      onClick={() => onClick(product)}
    >
      <div className="relative overflow-hidden aspect-auto">
        <img 
          src={product.imageUrl} 
          alt={product.title}
          className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        <div className="absolute bottom-0 left-0 p-4 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex justify-between items-end">
            <div>
              <h3 className={`text-lg font-bold text-white mb-1 ${fontClass}`}>{product.title}</h3>
              <p className="text-gray-300 text-sm line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {product.description}
              </p>
            </div>
            <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
              ${product.price}
            </span>
          </div>
        </div>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20">
            <Info size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

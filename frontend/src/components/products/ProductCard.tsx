import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductImage } from '../../utils/imageHelper';

interface Product {
  _id: string; name: string; price: number; unit: string;
  qualityLevel: string; stock: number; images: string[];
  category: { name: string; slug: string };
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  const qualityColors: Record<string, string> = {
    Premium: 'bg-blue-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5',
    Standard: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5',
    Economy: 'bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border border-gray-200 dark:border-gray-500',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block overflow-hidden h-52 bg-gray-100 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
        <img 
          src={product.images?.[0] || getProductImage(product)} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <Link 
            to={`/products/${product._id}`} 
            className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-xs tracking-tight leading-snug line-clamp-2 transition-colors"
          >
            {product.name}
          </Link>
          <span className={`whitespace-nowrap rounded-md ${qualityColors[product.qualityLevel] || qualityColors.Standard}`}>
            {product.qualityLevel}
          </span>
        </div>

        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-3">
          {product.category?.name}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-black text-gray-900 dark:text-white">Rs. {product.price.toLocaleString()}</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium ml-0.5">/{product.unit}</span>
          </div>
          <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${product.stock > 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 line-through'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

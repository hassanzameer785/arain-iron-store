import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 dark:bg-black text-gray-400 border-t border-gray-800 mt-auto transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img 
            src="/images/logo.png" 
            alt="Arain Iron Store" 
            className="w-9 h-9 object-cover rounded border border-gray-700" 
          />
          <div>
            <p className="font-bold text-white text-sm">Arain Iron Store</p>
            <p className="text-[10px] text-gray-500 font-medium">Vehova • Est. 1998</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Quality Construction Materials You Can Trust Since 1998. Enforced with premium durability.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Quick Links</h4>
        <ul className="space-y-2 text-xs">
          {[
            ['/', 'Home'], 
            ['/products', 'Products'], 
            ['/about', 'About'], 
            ['/contact', 'Contact']
          ].map(([to, label]) => (
            <li key={to}>
              <Link to={to} className="hover:text-blue-400 transition-colors">{label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Categories</h4>
        <ul className="space-y-2 text-xs">
          {[
            'Iron Materials', 
            'Cement & Concrete', 
            'Bricks', 
            'Pipes & Plumbing', 
            'Doors & Windows', 
            'Paint'
          ].map(cat => (
            <li key={cat}>
              <Link to={`/products?category=${cat}`} className="hover:text-blue-400 transition-colors">{cat}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Contact</h4>
        <ul className="space-y-2 text-xs text-gray-500">
          <li className="flex items-center gap-2">📍 Vehova, Pakistan</li>
          <li className="flex flex-col gap-1 mt-2">
            <span className="font-bold text-white">CEO Malik Kabeer</span>
            <span>📞 0334 7135272 (Phone & WhatsApp)</span>
          </li>
          <li className="flex flex-col gap-1 mt-2">
            <span className="font-bold text-white">Malik Zameer</span>
            <span>📞 0333 2530723</span>
            <span>💬 WA: 0033 23884785</span>
          </li>
          <li className="flex items-center gap-2 mt-2">✉️ info@arainiron.com</li>
        </ul>
        <div className="flex gap-2 mt-4">
          <a 
            href="https://wa.me/923320074326" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
          >
            💬 Chat 1
          </a>
          <a 
            href="https://wa.me/923323884785" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
          >
            💬 Chat 2
          </a>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-800 py-4 text-center text-[10px] text-gray-600 font-medium">
      © {new Date().getFullYear()} Arain Brothers & Sons. All rights reserved.
    </div>
  </footer>
);

export default Footer;

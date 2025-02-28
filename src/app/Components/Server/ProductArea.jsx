"use client";

import { useEffect, useState } from 'react';
import { getTopSellersProducts, getTopNewProducts } from '@/app/Services/Product';
import ProductWidget from './Productwidget';
import Cookies from 'js-cookie';

const RECENTLY_VIEWED_COOKIE = 'recently_viewed';

export default function ProductsArea() {
  const [topSellersProducts, setTopSellersProducts] = useState([]);
  const [topNewProducts, setTopNewProducts] = useState([]);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const [sellers, newProducts] = await Promise.all([
        getTopSellersProducts(),
        getTopNewProducts()
      ]);
      
      setTopSellersProducts(sellers);
      setTopNewProducts(newProducts);
      
      // Get recently viewed from cookies
      const recentlyViewed = Cookies.get(RECENTLY_VIEWED_COOKIE);
      if (recentlyViewed) {
        setRecentlyViewedProducts(JSON.parse(recentlyViewed));
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="product-widget-area">
      <div className="zigzag-bottom" />
      <div className="container">
        <div className="row">
          <ProductWidget 
            title="Top Sellers" 
            products={topSellersProducts} 
          />
           
          <ProductWidget 
            title="Recently Viewed"
            products={recentlyViewedProducts} 
          />

          <ProductWidget 
            title="Top New" 
            products={topNewProducts} 
          />
        </div>
      </div>
    </div>
  );
}
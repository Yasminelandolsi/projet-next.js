"use client";
import { useEffect } from 'react';
import Cookies from 'js-cookie';
const RECENTLY_VIEWED_COOKIE = 'recently_viewed';
const MAX_RECENT_PRODUCTS = 3;
const RecentlyViewedHandler = ({ product }) => {
  useEffect(() => {
    if (product) {
      const updateRecentlyViewed = () => {
        const recentlyViewed = Cookies.get(RECENTLY_VIEWED_COOKIE);
        let products = recentlyViewed ? JSON.parse(recentlyViewed) : [];
    
        // Remove if product already exists
        products = products.filter(p => p.id !== product.id);
        
        // Add new product at the beginning
        products.unshift({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageName
        });
        
        // Limit to MAX_RECENT_PRODUCTS
        products = products.slice(0, MAX_RECENT_PRODUCTS);
        
        // Save to cookie
        Cookies.set(RECENTLY_VIEWED_COOKIE, JSON.stringify(products), { expires: 7 });
      };

      updateRecentlyViewed();
    }
  }, [product]);

  return null; // This component doesn't render anything
};

export default RecentlyViewedHandler;
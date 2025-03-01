"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";

const RECENTLY_VIEWED_COOKIE = "recently_viewed";
const MAX_RECENT_PRODUCTS = 3;

const RecentlyViewedHandler = ({ product }) => {
  useEffect(() => {
    if (product) {

      const updateRecentlyViewed = () => {
        const recentlyViewed = Cookies.get(RECENTLY_VIEWED_COOKIE);
        let products = recentlyViewed ? JSON.parse(recentlyViewed) : [];

        products = products.filter((p) => p.id !== product.id);

        products.unshift({
          id: product.id,
          name: product.name,
          price: product.price,
          imageName: product.imageName, 
          review: product.review,       
          oldPrice: product.oldPrice, 
          discountRate: product.discountRate 
        });

        products = products.slice(0, MAX_RECENT_PRODUCTS);

        // Save to cookie
        Cookies.set(RECENTLY_VIEWED_COOKIE, JSON.stringify(products), {
          expires: 7,
        });

      };

      updateRecentlyViewed();
    }
  }, [product]);

  return null;
};

export default RecentlyViewedHandler;

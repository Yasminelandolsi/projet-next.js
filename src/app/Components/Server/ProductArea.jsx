"use client";
import { useEffect, useState } from "react";
import { getTopSellersProducts, getTopNewProducts, getRecentlyViewedProducts } from "@/app/Services/Product"; // Import function
import ProductWidget from "./Productwidget";

export default function ProductsArea() {
  const [topSellersProducts, setTopSellersProducts] = useState([]);
  const [topNewProducts, setTopNewProducts] = useState([]);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      console.log("Fetching products...");

      const [sellers, newProducts, recentlyViewed] = await Promise.all([
        getTopSellersProducts(),
        getTopNewProducts(),
        getRecentlyViewedProducts(), 
      ]);

     

      setTopSellersProducts(sellers);
      setTopNewProducts(newProducts);
      setRecentlyViewedProducts(recentlyViewed);
    };

    loadProducts();
  }, []);

  return (
    <div className="product-widget-area">
      <div className="zigzag-bottom" />
      <div className="container">
        <div className="row">
          <ProductWidget title="Top Sellers" products={topSellersProducts} />
          <ProductWidget title="Recently Viewed" products={recentlyViewedProducts} />
          <ProductWidget title="Top New" products={topNewProducts} />
        </div>
      </div>
    </div>
  );
}

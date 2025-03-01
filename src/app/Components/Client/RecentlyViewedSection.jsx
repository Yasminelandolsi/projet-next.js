"use client";
import { useEffect, useState } from "react";
import { getRecentlyViewedProducts } from "@/app/Services/Product";
import ProductWidget from "@/app/Components/server/Productwidget";

export default function RecentlyViewedSection() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    async function fetchRecentlyViewed() {
      const data = await getRecentlyViewedProducts();
      setRecentlyViewed(data);
    }

    fetchRecentlyViewed();
  }, []);

  return (
    <div className="single-sidebar">
      <h2 className="sidebar-title">Recently Viewed</h2>
      <ProductWidget products={recentlyViewed} />
    </div>
  );
}

import RecentlyViewedHandler from '@/app/Components/Client/RecentlyViewedHandler';
import { fetchProductById, getRecentlyViewedProducts } from "@/app/Services/Product"; 
import Link from "next/link";
import dynamic from "next/dynamic";
import RecentlyViewedSection from '@/app/Components/Client/RecentlyViewedSection';


const QuantityInput = dynamic(() => import("@/app/Components/Client/QuantityInput"));
const AddToCartButton = dynamic(() => import("@/app/Components/Client/AddToCartButton"));

export default async function ProductPage({ params, searchParams }) {
  const { id } = await params || {};
  const { categoryId } = await searchParams || {};

  const product = await fetchProductById(id);
  const recentlyViewedProducts = await getRecentlyViewedProducts(); 

  if (!product) {
    return <p>Product not found.</p>;
  }

  const imageFolder = product.imageName.split("-")[0].toLowerCase();
  const imagePath = `/img/products-img/${imageFolder}/${product.imageName}`;
  const categoryLabel = product.category || imageFolder;

  const oldPrice = product.price / (1 - product.discountRate / 100);

  return (
    <div className="single-product-area">
      <RecentlyViewedHandler product={product} />

      <div className="zigzag-bottom"></div>
      <div className="container">
        <div className="row">
          {/* Left Sidebar */}
          <div className="col-md-4">
              <RecentlyViewedSection />

            <div className="single-sidebar">
              <h2 className="sidebar-title">Others brands</h2>
              <ul>
                <li><Link href="#">Sony</Link></li>
                <li><Link href="#">Samsung</Link></li>
                <li><Link href="#">LG</Link></li>
              </ul>
            </div>
          </div>

          {/* Product Content */}
          <div className="col-md-8">
            <div className="product-content-right">
              <div className="product-breadcroumb">
                <Link href="/">Home</Link>
                {categoryId && <Link href={`/category/${categoryId}`}>{categoryLabel}</Link>}
                <span>{product.name}</span>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="product-images">
                    <div className="product-main-img">
                      <img src={imagePath} alt={product.name} />
                    </div>

                    <div className="product-gallery">
                      <img src="/img/product-thumb-1.jpg" alt="Thumbnail" />
                      <img src="/img/product-thumb-2.jpg" alt="Thumbnail" />
                      <img src="/img/product-thumb-3.jpg" alt="Thumbnail" />
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="product-inner">
                    <h2 className="product-name">{product.name}</h2>
                    <div className="product-inner-price">
                      <ins>${product.price}</ins> <del>${oldPrice.toFixed(2)}</del>
                    </div>

                    <form action="" className="cart">
                      <AddToCartButton product={product} />
                    </form>

                    <div className="product-inner-category">
                      <h2>Product Description</h2>
                      <p>{product.description}</p>
                    </div> 
                  </div>
                </div>
              </div>
            </div>                    
          </div>
        </div>
      </div>
    </div>
  );
}

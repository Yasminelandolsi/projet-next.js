import ProductShop from "@/app/Components/Server/ProductShop";
import { getProductsByCategory } from "@/app/Services/Product";
import Link from "next/link";

export default async function CategoryPage({ params }) {
  // Await `params` to resolve its properties
  const { id } = await params || {};

  try {
    const { categoryName, products } = await getProductsByCategory(id);

    if (!Array.isArray(products) || products.length === 0) {
      return <div>Aucun produit trouvé pour cette catégorie.</div>;
    }
    return (
      <>
        <div className="product-big-title-area">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="product-bit-title text-center">
                  <h2>{categoryName}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="single-product-area">
            <div className="zigzag-bottom"></div>
            <div className="container">
              <div className="row">
                {products.map((product) => {
                  if (!product.id) {
                    console.error(`Produit sans ID : ${product.name}`);
                    return null;
                  }

                  const imageUrl = product.imageName
                    ? `/img/products-img/${categoryName}/${product.imageName}`
                    : '/img/no-image-available.png';

                  const priceAfterDiscount = product.price * (1 - (product.discountRate / 100));

                  return (
                    <div key={product.id} className="col-md-4">
                      <Link href={`/product/${product.id}?categoryId=${id}`}>
                        <ProductShop
                          id={product.id}
                          image={imageUrl}
                          name={product.name}
                          rating={product.review}
                          price={priceAfterDiscount.toFixed(2)}
                          oldPrice={product.price.toFixed(2)}
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error.message);
    return <div>Erreur lors du chargement des produits.</div>;
  }
}
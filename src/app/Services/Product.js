import Cookies from 'js-cookie';
const RECENTLY_VIEWED_COOKIE = 'recently_viewed';
const MAX_RECENT_PRODUCTS = 3;
export async function getTopSellersProducts() {
  try {
      const response = await fetch('http://localhost:3000/top-sellers-products');
      if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
          throw new Error('Les données ne sont pas un tableau');
      }

      return data;
  } catch (error) {
      console.error('Erreur dans getTopSellersProducts:', error.message);
      return []; 
  }
}

export async function getTopNewProducts() {
  try {
      const response = await fetch('http://localhost:3000/top-new-products');
      if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
      }
      const data = await response.json();
  
      if (!Array.isArray(data)) {
          throw new Error('Les données ne sont pas un tableau');
      }

      return data;
  } catch (error) {
      console.error('Erreur dans getTopNewProducts:', error.message);
      return []; 
  }
}

export const getProductsByCategory = async (categoryId) => {
  try {
      const categoriesResponse = await fetch('http://localhost:3000/categories');
      const categories = await categoriesResponse.json();
      const category = categories.find((item) => item.id === categoryId);
      
      const categoryName = category ? category.name : 'default';  

      const productsListsResponse = await fetch('http://localhost:3000/products-lists');
      const productsLists = await productsListsResponse.json();
      
      const productList = productsLists.find((list) => list.id === category.productListId);
      
      return {
          categoryName,
          products: productList ? productList.items : [],
      };
  } catch (error) {
      return { categoryName: 'default', products: [] };
  }
};

export async function fetchProductById(productId) {
  try {
      const response = await fetch(`http://localhost:3000/products/${productId}`);
      if (!response.ok) {
          throw new Error('Erreur lors de la récupération du produit');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Erreur dans fetchProductById:', error.message);
      return null;
  }
}
export async function getAllProducts() {
    try {
      const response = await fetch('http://localhost:3000/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Products data is not in the expected format');
      }
      
      return data;
    } catch (error) {
      console.error('Error in getAllProducts:', error.message);
      return [];
    }
  }
  export const updateRecentlyViewed = (product) => {
    try {
      const recentlyViewed = Cookies.get(RECENTLY_VIEWED_COOKIE); // Fixed line
      let products = recentlyViewed ? JSON.parse(recentlyViewed) : [];
      
      products = products.filter(p => p.id !== product.id);
      products.unshift({
        id: product.id,
        name: product.name,
        price: product.price,
        imageName: product.imageName,
        rating: product.review,
        oldPrice: product.oldPrice,
        discountRate: product.discountRate
      });
      
      products = products.slice(0, MAX_RECENT_PRODUCTS);
      Cookies.set(RECENTLY_VIEWED_COOKIE, JSON.stringify(products), { expires: 7 });
      return products;
    } catch (error) {
      console.error('Error updating recently viewed:', error);
      return [];
    }
  };
  
  export const getRecentlyViewedProducts = async () => {
    try {
      const recentlyViewed = Cookies.get(RECENTLY_VIEWED_COOKIE);
      const products = recentlyViewed ? JSON.parse(recentlyViewed) : [];
      return products;
    } catch (error) {
      console.error('Error getting recently viewed products:', error);
      return [];
    }
  };
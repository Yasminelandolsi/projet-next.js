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
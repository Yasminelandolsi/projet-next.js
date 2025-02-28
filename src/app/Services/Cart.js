const API_BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
  CARTS: `${API_BASE_URL}/carts`
};

function calculateCartTotals(items = []) {
  const subTotal = items.reduce((acc, item) => 
    acc + (parseFloat(item.price) * parseInt(item.quantity, 10)), 0
  );
  const tax = subTotal * 0.2;
  const total = subTotal + tax;
  return { 
    subTotal: parseFloat(subTotal.toFixed(2)), 
    tax: parseFloat(tax.toFixed(2)), 
    total: parseFloat(total.toFixed(2)) 
  };
}

function formatCartForAPI(cart) {
  if (!cart || !cart.items) return null;
  
  const { subTotal, tax, total } = calculateCartTotals(cart.items);
  
  return {
    id: cart.id,
    total,
    subTotal,
    tax,
    items: cart.items.map(item => ({
      id: parseInt(item.id),
      name: item.name,
      imageName: item.image?.split('/').pop() || '',
      price: parseFloat(item.price),
      qty: parseInt(item.quantity, 10)
    }))
  };
}

export async function createCart() {
  const cartId = crypto.randomUUID();
  const newCart = { 
    id: cartId, 
    items: [], 
    orderTotal: 0 
  };
  
  try {
    const formattedCart = formatCartForAPI(newCart);
    const response = await fetch(API_ENDPOINTS.CARTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedCart)
    });

    if (!response.ok) throw new Error('Failed to create cart');
    
    localStorage.setItem('currentCart', JSON.stringify(newCart));
    return newCart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

export async function updateCart(cart) {
  if (!cart?.id) throw new Error('Cart ID is required');
  
  try {
    const plainCart = JSON.parse(JSON.stringify(cart));
    const formattedCart = formatCartForAPI(plainCart);
    
    if (!formattedCart) throw new Error('Invalid cart data');

    const response = await fetch(`${API_ENDPOINTS.CARTS}/${cart.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedCart)
    });

    if (!response.ok) throw new Error('Failed to update cart');
    
    localStorage.setItem('currentCart', JSON.stringify(plainCart));
    return plainCart;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
}

export async function getCurrentCart() {
  try {
    const savedCart = localStorage.getItem('currentCart');
    if (!savedCart) return null;

    const parsedCart = JSON.parse(savedCart);
    if (!parsedCart?.id) return null;

    const response = await fetch(`${API_ENDPOINTS.CARTS}/${parsedCart.id}`);
    if (!response.ok) return null;

    return parsedCart;
  } catch (error) {
    console.error('Error getting cart:', error);
    return null;
  }
}
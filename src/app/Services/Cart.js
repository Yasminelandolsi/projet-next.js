// Simulated in-memory "backend"
let carts = {};

// Function to generate a unique cart ID
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9); // Simple unique ID generator
}

// Simulated API to create a cart
export async function createCart() {
  const cartId = generateUniqueId(); // Generate a unique ID for the cart
  carts[cartId] = { id: cartId, items: [], orderTotal: 0 }; // Initialize the cart
  return carts[cartId]; // Return the cart data
}

// Simulated API to update a cart
export async function updateCart(cart) {
  const { cartId } = cart;
  if (!carts[cartId]) {
    throw new Error('Cart not found');
  }
  carts[cartId] = cart; // Update the cart
  return carts[cartId]; // Return the updated cart
}
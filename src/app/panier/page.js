"use client";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, updateItem, updateOrderTotal } from "../../redux/slices/cartSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import img1 from "../../../public/img/product-2.jpg";
import img2 from "../../../public/img/product-4.jpg";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart || { items: [] });
  const router = useRouter();

  const handleRemove = useCallback((itemId) => {
    dispatch(removeItem(itemId));
  }, [dispatch]);

  const handleQuantityChange = useCallback(
    (itemId, newQuantity) => {
      if (newQuantity < 1) return;
      const item = cart.items.find((item) => item.id === itemId);
      if (item) {
        dispatch(updateItem({ ...item, quantity: newQuantity }));
      }
    },
    [dispatch, cart.items]
  );

  const cartSubtotal = cart.items.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 0),
    0
  );
  const tax = cartSubtotal * 0.2;
  const orderTotal = cartSubtotal + tax;

  useEffect(() => {
    dispatch(updateOrderTotal(orderTotal || 0));
  }, [orderTotal, dispatch]);

  return (
    <div className="single-product-area">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="product-content-right">
              <div className="woocommerce">
                <table className="shop_table cart" cellSpacing="0">
                  <thead>
                    <tr>
                      <th className="product-remove">&nbsp;</th>
                      <th className="product-name">Product</th>
                      <th className="product-price">Price</th>
                      <th className="product-quantity">Quantity</th>
                      <th className="product-subtotal">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.length > 0 ? (
                      cart.items.map((item) => {
                        const price = parseFloat(item.price) || 0;
                        const quantity = parseInt(item.quantity, 10) || 0;
                        const total = price * quantity;

                        return (
                          <tr key={item.id} className="cart_item">
                            <td className="product-remove">
                              <button className="remove" onClick={() => handleRemove(item.id)}>
                                ×
                              </button>
                            </td>
                           
                           
                            <td className="product-name">{item.name}</td>
                            <td className="product-price">{price.toFixed(2)}€</td>
                            <td className="product-quantity">
                              <div className="quantity buttons_added">
                                <button onClick={() => handleQuantityChange(item.id, quantity - 1)}>-</button>
                                <input type="number" value={quantity} readOnly />
                                <button onClick={() => handleQuantityChange(item.id, quantity + 1)}>+</button>
                              </div>
                            </td>
                            <td className="product-subtotal">{total.toFixed(2)}€</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          Your cart is currently empty.
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="actions" colSpan="6">
                        <button onClick={() => router.push('/checkout')} className="checkout-button">
                          Checkout
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="cart_totals">
                  <h2>Cart Totals</h2>
                  <table cellSpacing="0">
                    <tbody>
                      <tr className="cart-subtotal">
                        <th>Cart Subtotal</th>
                        <td>{cartSubtotal.toFixed(2)} €</td>
                      </tr>
                      <tr className="shipping">
                        <th>Tax (20%)</th>
                        <td>{tax.toFixed(2)} €</td>
                      </tr>
                      <tr className="order-total">
                        <th>Order Total</th>
                        <td>
                          <strong>{orderTotal.toFixed(2)} €</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>                        
            </div>                    
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

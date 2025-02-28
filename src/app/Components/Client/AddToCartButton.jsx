"use client";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../../../redux/slices/cartSlice';
import QuantityInput from './QuantityInput';

const AddToCartButton = ({ product }) => {
  const dispatch = useDispatch();
  const [currentQuantity, setCurrentQuantity] = useState(1);

  const handleAddToCart = (e) => {
    e.preventDefault();
    const totalPrice = parseFloat(product.price) * currentQuantity;
    
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price, // Keep original price per unit
      quantity: currentQuantity,
      image: product.imageName,
      totalPrice: totalPrice // Add total price based on quantity
    }));
  };

  return (
    <div className="add-to-cart-wrapper">
      <QuantityInput 
        initialValue={1}
        onChange={(quantity) => setCurrentQuantity(quantity)}
      />
      <button 
        className="add_to_cart_button" 
        type="button"
        onClick={handleAddToCart}
      >
        Add to cart (${(product.price * currentQuantity).toFixed(2)})
      </button>
    </div>
  );
};

export default AddToCartButton;
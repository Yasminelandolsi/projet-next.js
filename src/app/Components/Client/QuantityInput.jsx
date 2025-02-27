//// filepath: /C:/Users/YasmineLandolsi/Desktop/next/e-commerce/src/app/components/QuantityInput.js
"use client";

import { useState } from "react";

export default function QuantityInput({ initialValue = 1, onChange }) {
  const [quantity, setQuantity] = useState(initialValue);

  const handleChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity);
    if (onChange) onChange(newQuantity);
  };

  return (
    <div className="quantity">
      <input
        type="number"
        size="4"
        className="input-text qty text"
        title="Qty"
        value={quantity}
        name="quantity"
        min="1"
        step="1"
        onChange={handleChange}
      />
    </div>
  );
}
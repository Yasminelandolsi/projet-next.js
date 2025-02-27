"use client";
import Link from 'next/link';
import { useSelector } from 'react-redux';

const CartComponent = () => {
  // Access cart state from Redux store
  const { items, orderTotal } = useSelector((state) => state.cart);

  // Calculate the cart item count
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="col-sm-4">
      <div className="shopping-item">
        <Link href="/panier">
          Cart : <span className="cart-amunt">{orderTotal.toFixed(2)} $</span>
          <i className="fa fa-shopping-cart"></i>
          <span className="product-count">{itemCount}</span>
        </Link>
      </div>
    </div>
  );
};

export default CartComponent;

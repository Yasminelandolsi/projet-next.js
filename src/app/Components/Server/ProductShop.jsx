import { useDispatch } from "react-redux";
import { addItem } from "e-commerce\src\redux\slices\cartSlice.js"; // Import the addItem action

function ProductShop({ id, image, name, rating, price, oldPrice }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    const product = {
      id,
      image,
      name,
      price,
      quantity: 1, // Assuming default quantity is 1
    };

    // Dispatch the addItem action
    dispatch(addItem(product));
  };

  return (
    <div className="product-item">
      <div className="product-image">
        <img src={image} alt={name} className="img-fluid" />
      </div>
      <h3>{name}</h3>
      <div className="product-price">
        <ins>{`$${price}`}</ins>
        {oldPrice && <del>{`$${oldPrice}`}</del>}
      </div>
      <div className="product-add-to-cart">
        <button className="btn btn-primary" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductShop;

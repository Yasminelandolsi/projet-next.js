"use client"; // Mark this as a Client Component
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // Add useDispatch
import { useRouter } from "next/navigation"; // Use Next.js router
import { clearCart } from "../../redux/slices/cartSlice"; // Import clearCart action

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch(); // Get dispatch function
  const cart = useSelector((state) => state.cart);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    billing_country: "AX",
    billing_first_name: "",
    billing_last_name: "",
    billing_company: "",
    billing_address_1: "",
    billing_address_2: "",
    billing_city: "",
    billing_state: "",
    billing_postcode: "",
    billing_email: "",
    billing_phone: "",
    ship_to_different_address: true,
    shipping_country: "AX",
    shipping_first_name: "",
    shipping_last_name: "",
    shipping_company: "",
    shipping_address_1: "",
    shipping_address_2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_postcode: "",
    order_comments: "",
    payment_method: "bacs",
  });

  const validateField = (name, value) => {
    switch (name) {
      case "billing_email":
        return !value.includes("@") ? "Invalid email address" : "";
      case "billing_phone":
        return !/^\d{8}$/.test(value) ? "Phone must be 8 digits" : "";
      case "billing_first_name":
      case "billing_last_name":
      case "shipping_first_name":
      case "shipping_last_name":
        return value.length < 2 ? "Must be at least 2 characters" : "";
      case "billing_postcode":
      case "shipping_postcode":
        return !/^\d{4}$/.test(value) ? "Invalid postal code" : "";
      case "billing_address_1":
      case "shipping_address_1":
      case "billing_city":
      case "shipping_city":
        return value.trim() === "" ? "This field is required" : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
    const error = validateField(name, inputValue);
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (
        key.includes("billing_") ||
        (formData.ship_to_different_address && key.includes("shipping_"))
      ) {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      setFormErrors(newErrors);
      return;
    }

    console.log("Order submitted:", formData);
    
    dispatch(clearCart()); // Wait for clearCart to complete
    router.push("/"); // Now navigate to home
  };

  const cartSubtotal = cart.items.reduce(
    (acc, item) =>
      acc + (parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 0),
    0
  );
  const tax = cartSubtotal * 0.2;
  const orderTotal = cartSubtotal + tax;

  return (
    <div>
      <div className="product-big-title-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="product-bit-title text-center">
                <h2>Checkout</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="single-product-area">
        <div className="zigzag-bottom"></div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="product-content-right">
                <div className="woocommerce">
                  <form
                    onSubmit={handleSubmit}
                    className="checkout"
                    method="post"
                    name="checkout"
                  >
                    <div id="customer_details" className="col2-set">
                      <div className="col-6">
                        <div className="woocommerce-billing-fields">
                          <h3>Billing Details</h3>
                          <p className="form-row form-row-wide">
                            <label>
                              Civility <abbr className="required">*</abbr>
                            </label>
                            <select
                              name="billing_country"
                              value={formData.billing_country}
                              onChange={handleInputChange}
                              className="country_select"
                            >
                              <option value="AX">Mr</option>
                              <option value="AF">Mlle</option>
                              <option value="MM">Mme</option>
                            </select>
                          </p>
                          <p className="form-row form-row-first">
                            <label>
                              First Name <abbr className="required">*</abbr>
                            </label>
                            <input
                              type="text"
                              name="billing_first_name"
                              value={formData.billing_first_name}
                              onChange={handleInputChange}
                              className={`input-text ${
                                formErrors.billing_first_name ? "error" : ""
                              }`}
                            />
                            {formErrors.billing_first_name && (
                              <span className="error-message">
                                {formErrors.billing_first_name}
                              </span>
                            )}
                          </p>
                          <p className="form-row form-row-last">
                            <label>
                              Last Name <abbr className="required">*</abbr>
                            </label>
                            <input
                              type="text"
                              name="billing_last_name"
                              value={formData.billing_last_name}
                              onChange={handleInputChange}
                              className={`input-text ${
                                formErrors.billing_last_name ? "error" : ""
                              }`}
                            />
                            {formErrors.billing_last_name && (
                              <span className="error-message">
                                {formErrors.billing_last_name}
                              </span>
                            )}
                          </p>
                          <div className="clear"></div>
                          <p className="form-row form-row-wide">
                            <label>Company Name</label>
                            <input
                              type="text"
                              name="billing_company"
                              value={formData.billing_company}
                              onChange={handleInputChange}
                              className="input-text"
                            />
                          </p>
                          <p className="form-row form-row-wide">
                            <label>
                              Address <abbr className="required">*</abbr>
                            </label>
                            <input
                              type="text"
                              name="billing_address_1"
                              value={formData.billing_address_1}
                              onChange={handleInputChange}
                              className={`input-text ${
                                formErrors.billing_address_1 ? "error" : ""
                              }`}
                              placeholder="Street address"
                            />
                            {formErrors.billing_address_1 && (
                              <span className="error-message">
                                {formErrors.billing_address_1}
                              </span>
                            )}
                          </p>
                          <p className="form-row form-row-wide">
                            <input
                              type="text"
                              name="billing_address_2"
                              value={formData.billing_address_2}
                              onChange={handleInputChange}
                              className="input-text"
                              placeholder="Apartment, suite, unit etc. (optional)"
                            />
                          </p>
                          <p className="form-row form-row-wide">
                            <label>
                              Town / City <abbr className="required">*</abbr>
                            </label>
                            <input
                              type="text"
                              name="billing_city"
                              value={formData.billing_city}
                              onChange={handleInputChange}
                              className={`input-text ${
                                formErrors.billing_city ? "error" : ""
                              }`}
                            />
                            {formErrors.billing_city && (
                              <span className="error-message">
                                {formErrors.billing_city}
                              </span>
                            )}
                          </p>
                          <p className="form-row form-row-first">
                            <label>Country</label>
                            <input
                              type="text"
                              name="billing_state"
                              value={formData.billing_state}
                              onChange={handleInputChange}
                              className="input-text"
                            />
                          </p>
                          <p className="form-row form-row-last">
                            <label>
                              Postcode <abbr className="required">*</abbr>
                            </label>
                            <input
                              type="text"
                              name="billing_postcode"
                              value={formData.billing_postcode}
                              onChange={handleInputChange}
                              className={`input-text ${
                                formErrors.billing_postcode ? "error" : ""
                              }`}
                            />
                            {formErrors.billing_postcode && (
                              <span className="error-message">
                                {formErrors.billing_postcode}
                              </span>
                            )}
                          </p>
                          <div className="clear"></div>
                          <p className="form-row form-row-first">
                            <label>
                              Email Address <abbr className="required">*</abbr>
                            </label>
                            <input
                              type="email"
                              name="billing_email"
                              value={formData.billing_email}
                              onChange={handleInputChange}
                              className={`input-text ${
                                formErrors.billing_email ? "error" : ""
                              }`}
                            />
                            {formErrors.billing_email && (
                              <span className="error-message">
                                {formErrors.billing_email}
                              </span>
                            )}
                          </p>
                          <p className="form-row form-row-last">
                            <label>
                              Phone <abbr className="required">*</abbr>
                            </label>
                            <input
                              type="tel"
                              name="billing_phone"
                              value={formData.billing_phone}
                              onChange={handleInputChange}
                              className={`input-text ${
                                formErrors.billing_phone ? "error" : ""
                              }`}
                            />
                            {formErrors.billing_phone && (
                              <span className="error-message">
                                {formErrors.billing_phone}
                              </span>
                            )}
                          </p>
                          <div className="clear"></div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="woocommerce-shipping-fields">
                          <h3>
                            <label className="checkbox">
                              Ship to a different address?
                              <input
                                type="checkbox"
                                name="ship_to_different_address"
                                checked={formData.ship_to_different_address}
                                onChange={handleInputChange}
                                className="input-checkbox"
                              />
                            </label>
                          </h3>
                          {formData.ship_to_different_address && (
                            <div className="shipping_address">
                              {/* Shipping form fields similar to billing fields */}
                            </div>
                          )}
                          <p className="form-row notes">
                            <label>Order Notes</label>
                            <textarea
                              name="order_comments"
                              value={formData.order_comments}
                              onChange={handleInputChange}
                              className="input-text"
                              placeholder="Notes about your order, e.g. special notes for delivery."
                              rows="2"
                              cols="5"
                            ></textarea>
                          </p>
                        </div>
                      </div>
                    </div>
                    <h3>Your order</h3>
                    <div id="order_review">
                      <table className="shop_table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.items.map((item) => (
                            <tr key={item.id} className="cart_item">
                              <td>
                                {item.name} <strong>× {item.quantity}</strong>
                              </td>
                              <td>
                                <span className="amount">
                                  {(item.price * item.quantity).toFixed(2)} €
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th>Cart Subtotal</th>
                            <td>
                              <span className="amount">
                                {cartSubtotal.toFixed(2)} €
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <th>Tax (20%)</th>
                            <td>{tax.toFixed(2)} €</td>
                          </tr>
                          <tr>
                            <th>Order Total</th>
                            <td>
                              <strong>
                                <span className="amount">
                                  {orderTotal.toFixed(2)} €
                                </span>
                              </strong>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                      <div id="payment">
                        <ul className="payment_methods methods">
                          <li>
                            <input
                              type="radio"
                              name="payment_method"
                              value="bacs"
                              checked={formData.payment_method === "bacs"}
                              onChange={handleInputChange}
                              className="input-radio"
                            />
                            <label>Direct Bank Transfer</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="payment_method"
                              value="cheque"
                              checked={formData.payment_method === "cheque"}
                              onChange={handleInputChange}
                              className="input-radio"
                            />
                            <label>Cheque Payment</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="payment_method"
                              value="paypal"
                              checked={formData.payment_method === "paypal"}
                              onChange={handleInputChange}
                              className="input-radio"
                            />
                            <label>
                              PayPal
                              <img
                                alt="PayPal Acceptance Mark"
                                src="https://www.paypalobjects.com/webstatic/mktg/Logo/AM_mc_vs_ms_ae_UK.png"
                              />
                            </label>
                          </li>
                        </ul>
                        <div className="form-row place-order">
                        <button   className="button alt"  onClick={(e) => {
                              e.preventDefault();
                              handleSubmit(e);}}>Place Order</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
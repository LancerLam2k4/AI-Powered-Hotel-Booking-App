import React from 'react';
import './ShoppingCart.css';

function ShoppingCart() {
  const cartItems = [
    { name: 'Room404', description: 'Single Room', price: 440000, quantity: 1 },
    { name: 'Room404', description: 'Double Room', price: 440000, quantity: 1 },
    { name: 'Room404', description: 'Suite', price: 440000, quantity: 1 },
  ];

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <div className="cart-content">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-items-count">{cartItems.length} items</p>
        </div>
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="item-info">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
              </div>
              <div className="item-controls">
                <button className="quantity-btn">-</button>
                <input
                  type="quantity"
                  className="quantity-input"
                  value={item.quantity}
                  readOnly
                />
                <button className="quantity-btn">+</button>
              </div>
              <div className="item-price">
                <span>{item.price.toLocaleString('vi-VN')} VNĐ</span>
                <button className="remove-btn">
                  <ion-icon name="trash"></ion-icon>
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="back-btn">← Back to shop</button>
      </div>
      <div className="cart-summary">
        <h2>Summary</h2>
        <div className="summary-item">
          <span>ITEMS: {cartItems.length}</span>
          <span>{calculateTotal().toLocaleString('vi-VN')} VNĐ</span>
        </div>
        <div className="summary-item">
          <span>TAX:</span>
          <span>{(2000).toLocaleString('vi-VN')} VNĐ</span>
          
        </div>
        <div className="summary-code">
          <label htmlFor="promo-code">GIVE CODE(IF ANY)</label>
          <input type="text" id="promo-code" placeholder="Enter your code" />
        </div>
        <div className="summary-total">
          <span>TOTAL PRICE:</span>
          
          <span>{(calculateTotal() + 2000).toLocaleString('vi-VN')} VNĐ</span>
        </div>
        <button className="checkout-btn">CHECKOUT</button>
      </div>
    </div>
  );
}

export default ShoppingCart;

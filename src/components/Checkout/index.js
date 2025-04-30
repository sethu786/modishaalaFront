import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import PaymentModal from '../PaymentModal';
import './index.css';

const Checkout = () => {
  const { cart, getTotal, clearCart } = useContext(AppContext);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const placeOrder = async () => {
    const token = Cookies.get('jwt_token');
    const orderData = { address, paymentMethod, items: cart, total: getTotal() };

    try {
      const res = await fetch('https://mobishaalaback-6.onrender.com/order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        alert('Order placed successfully!');
        navigate('/');
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch {
      setError('Network error. Try again.');
    }
  };

  const handlePayClick = () => {
    if (!address) {
      setError('Please enter your address');
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>
      {/* Address */}
      <div className="checkout-section">
        <h3 className="section-title">Shipping Address</h3>
        <textarea
          className="address-input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows="4"
          placeholder="Enter your address"
        />
      </div>
      {/* Payment Method */}
      <div className="checkout-section">
        <h3 className="section-title">Payment Method</h3>
        <select
          className="payment-method-select"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>UPI</option>
          <option>Cash on Delivery</option>
        </select>
      </div>
      {/* Order Summary */}
      <div className="checkout-section">
        <h3 className="section-title">Order Summary</h3>
        <ul className="order-summary-list">
          {cart.map((item) => (
            <li key={item.id} className="order-item">
              {item.name} x {item.quantity} = ₹{item.price * item.quantity}
            </li>
          ))}
        </ul>
        <strong className="order-total">Total: ₹{getTotal()}</strong>
      </div>

      {error && <p className="error-message">{error}</p>}
      <button className="place-order-button" onClick={handlePayClick}>
        Pay & Place Order
      </button>

      {showModal && (
        <PaymentModal
          amount={getTotal()}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            placeOrder();
          }}
        />
      )}
    </div>
  );
};

export default Checkout;

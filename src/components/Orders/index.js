import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('jwt_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('https://mobishaalaback-6.onrender.com/orders/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load orders');
        setLoading(false);
      });
  }, [navigate]);

  const stageIndex = (status) => {
    switch (status) {
      case 'Processing': return 1;
      case 'Shipping': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  if (loading) return <p className="orders-loading">Loading orders...</p>;
  if (error) return <p className="orders-error">{error}</p>;

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <div className="orders-empty-wrapper">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3875/3875141.png"
            alt="No orders"
            className="orders-empty-image"
          />
          <p className="orders-empty-text">You haven't placed any orders yet</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Payment:</strong> {order.payment_method}</p>
            <div className="progress-bar">
              {[1, 2, 3].map((step) => (
                <div key={step} className={`step ${stageIndex(order.status) >= step ? 'active' : ''}`}>
                  <div className="circle">{step}</div>
                  <div className="label">
                    {step === 1 ? 'Processing' : step === 2 ? 'Shipping' : 'Delivered'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;

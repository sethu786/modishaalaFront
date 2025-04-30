import React, { useState } from 'react';
import './index.css';

const PaymentModal = ({ amount, onClose, onSuccess }) => {
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    // mock gateway delay
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Enter Payment Details</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Card Number"
            value={card}
            onChange={(e) => setCard(e.target.value)}
            required
            className="modal-input"
          />
          <div className="modal-row">
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              required
              className="modal-input half"
            />
            <input
              type="password"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
              className="modal-input half"
            />
          </div>
          <button type="submit" className="modal-button" disabled={processing}>
            {processing ? 'Processing...' : `Pay ₹${amount}`}
          </button>
        </form>
        <button onClick={onClose} className="modal-close">Cancel</button>
      </div>
    </div>
  );
};

export default PaymentModal;

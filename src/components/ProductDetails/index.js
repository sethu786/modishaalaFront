import React, { Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import './index.css';

// HOC to inject router params and navigate into a class component
function withRouter(Component) {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    return <Component {...props} params={params} navigate={navigate} />;
  };
}

class ProductDetails extends Component {
  static contextType = AppContext;

  state = {
    product: null,
    quantity: 1,
    error: '',
  };

  async componentDidMount() {
    const { productId } = this.props.params;
    try {
      const res = await fetch(`https://mobishaalaback-6.onrender.com/products/${productId}/`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      this.setState({ product: data });
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  handleIncrement = () => {
    this.setState((s) => {
      const max = s.product?.stock || 1;
      return { quantity: Math.min(s.quantity + 1, max) };
    });
  };

  handleDecrement = () => {
    this.setState((s) => ({ quantity: Math.max(s.quantity - 1, 1) }));
  };

  handleAddToCart = () => {
    const { product, quantity } = this.state;
    this.context.addToCart({ ...product, quantity });
    this.props.navigate('/cart');
  };

  render() {
    const { product, quantity, error } = this.state;
    if (error) return <p className="pd-error">{error}</p>;
    if (!product) return <p className="pd-loading">Loading...</p>;

    return (
      <div className="pd-container">
        <div className="pd-details">
          <div className="pd-image">
            <img src={product.url} alt={product.name} />
          </div>
          <div className="pd-info">
            <h2>{product.name}</h2>
            <p className="pd-category">Category: {product.category}</p>
            <p className="pd-desc">{product.description}</p>
            <div className="pd-rating">
              {'★'.repeat(Math.floor(product.rating)) +
                '☆'.repeat(5 - Math.floor(product.rating))}{' '}
              <span>({product.rating})</span>
            </div>
            <div className="pd-price">Price: ₹{product.price}</div>
            <div className="pd-stock">In stock: {product.stock}</div>

            <div className="pd-quantity">
              <button onClick={this.handleDecrement}>–</button>
              <span>{quantity}</span>
              <button onClick={this.handleIncrement}>+</button>
            </div>

            <button className="pd-add" onClick={this.handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="pd-testimonials">
          <h3>What our customers say</h3>
          <div className="pd-testimonial-list">
            {[
              {
                name: 'Aarav Mehta',
                review: 'Excellent product! Great quality and fast delivery.',
                rating: 5,
              },
              {
                name: 'Riya Sharma',
                review: 'Good value for money. Would definitely recommend.',
                rating: 4,
              },
              {
                name: 'Kabir Verma',
                review: 'Decent product, but the packaging could be better.',
                rating: 3,
              },
            ].map((t, index) => (
              <div key={index} className="pd-testimonial">
                <p className="pd-review">"{t.review}"</p>
                <div className="pd-stars">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                <p className="pd-user">- {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProductDetails);

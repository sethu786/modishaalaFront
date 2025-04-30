import React, { Component } from 'react';
import { AppContext } from '../../context/AppContext';
import CategoryCarousel from '../CategoryCarousel';
import ImageCarousel from '../ImageCarousel';
import { Link } from 'react-router-dom';
import './index.css';

class Home extends Component {
  static contextType = AppContext;

  state = {
    products: [],
    categories: [],
    selectedCategory: 'All',
    error: '',
    sortBy: 'lowToHigh',
  };

  async componentDidMount() {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('https://mobishaalaback-6.onrender.com/products/'),
        fetch('https://mobishaalaback-6.onrender.com/categories/'),
      ]);
      const products = await productsRes.json();
      const categories = await categoriesRes.json();
      if (productsRes.ok && categoriesRes.ok) {
        this.setState({
          products,
          categories: ['All', ...categories],
        });
      } else {
        this.setState({ error: 'Failed to fetch data' });
      }
    } catch (err) {
      this.setState({ error: 'Network error. Try again later.' });
    }
  }

  handleSortChange = (e) => {
    this.setState({ sortBy: e.target.value });
  };

  handleCategoryChange = (e) => {
    this.setState({ selectedCategory: e.target.value });
  };

  render() {
    const { products, error, sortBy, categories, selectedCategory } = this.state;
    const { searchTerm } = this.context;
    const filteredProducts = products
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((product) =>
        selectedCategory === 'All' || product.category === selectedCategory
      );
    
    const sortedProducts = filteredProducts.sort((a, b) =>
      sortBy === 'lowToHigh' ? a.price - b.price : b.price - a.price
    );

    return (
      <div className="home-container">
        <h1>Featured Products</h1>
        <CategoryCarousel />
        <ImageCarousel/>
        {error && <p className="error">{error}</p>}

        <div className="filter-section">
          <label htmlFor="categoryFilter">Category: </label>
          <select id="categoryFilter" value={selectedCategory} onChange={this.handleCategoryChange}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label htmlFor="priceSort">Sort by Price: </label>
          <select id="priceSort" value={sortBy} onChange={this.handleSortChange}>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>

        <div className="product-list">
          {sortedProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.url} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>

              <div className="stars">
                {'★'.repeat(Math.floor(product.rating)) +
                  '☆'.repeat(5 - Math.floor(product.rating))}
                <span style={{ color: '#555', marginLeft: '6px' }}>
                  ({product.rating})
                </span>
              </div>

              <div className="price">
                <span className="original-price">₹{(product.price + 630).toLocaleString()}</span>
                <span className="discount-price">₹{product.price.toLocaleString()}</span>
              </div>

              <Link to={`/products/${product.id}`} className="view-details">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Home;

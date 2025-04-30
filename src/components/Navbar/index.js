import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Cookie from 'js-cookie';
import './index.css';

class Navbar extends Component {
  static contextType = AppContext;

  state = {
    fetchedUsername: '',
  };

  componentDidMount() {
    this.fetchUsernameFromBackend();
  }

  fetchUsernameFromBackend = () => {
    const token = Cookie.get('jwt_token');
    if (!token) return;

    fetch('https://mobishaalaback-6.onrender.com/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.username) {
          this.setState({ fetchedUsername: data.username });
        }
      })
      .catch((err) => console.error('Failed to fetch username:', err));
  };

  handleSearch = (event) => {
    const { setSearchTerm } = this.context;
    setSearchTerm(event.target.value);
  };

  handleLogout = () => {
    Cookie.remove('jwt_token');
    this.setState({
      cart: [],
      cartLoaded: false,
    });
    window.location.href = '/login';
  };

  render() {
    const { searchTerm, cart } = this.context;
    const { fetchedUsername } = this.state;

    return (
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">🛍️ Shop</Link>
        </div>

        <div className="navbar-center">
          <input
            type="text"
            value={searchTerm}
            onChange={this.handleSearch}
            placeholder="Search products..."
            className="search-input"
          />
        </div>

        <div className="navbar-right">
          <span className="username">Hi, {fetchedUsername || 'Guest'}</span>

          <Link to="/cart" className="nav-link">
            🛒 Cart ({cart.length})
          </Link>

          <Link to="/orders" className="nav-link">
            📦 Orders
          </Link>

          <button onClick={this.handleLogout} className="logout-button">
            🚪 Logout
          </button>
        </div>
      </nav>
    );
  }
}

const NavbarWrapper = (props) => {
  const navigate = useNavigate();
  return <Navbar {...props} navigate={navigate} />;
};

export default NavbarWrapper;

import React, { createContext, Component } from 'react';
import Cookies from 'js-cookie';

const AppContext = createContext();

class AppProvider extends Component {
  state = {
    searchTerm: '',
    cart: [],
    orders: [],
    cartLoaded: false,
    ordersLoaded: false,
    authToken: Cookies.get('jwt_token') || null,
  };
  componentDidMount() {
    this.cookieCheckInterval = setInterval(() => {
      const token = Cookies.get('jwt_token') || null;
      if (token !== this.state.authToken) {
        this.setState({ authToken: token, cartLoaded: false, ordersLoaded: false });
      }
    }, 1000);
  
    if (this.state.authToken) {
      this.loadCartFromServer();
      this.loadOrdersFromServer();
    }
  }
  

  checkAuthToken = () => {
    const tokenInCookie = Cookies.get('jwt_token') || null;
    if (tokenInCookie !== this.state.authToken) {
      this.setState({ authToken: tokenInCookie });
    }
  };
  setAuthToken = (token) => {
    this.setState({ authToken: token, cartLoaded: false, ordersLoaded: false });
  };
  
  loadCartFromServer = async () => {
    const token = Cookies.get('jwt_token');
    if (!token) return;

    console.log('Fetching cart from server...');
    try {
      const response = await fetch('https://mobishaalaback-6.onrender.com/cart/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      this.setState({ cart: data, cartLoaded: true });
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  loadOrdersFromServer = async () => {
    const { authToken } = this.state;
    if (!authToken) return;
    try {
      const res = await fetch('https://mobishaalaback-6.onrender.com/orders/', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      this.setState({ orders: data, ordersLoaded: true });
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  setSearchTerm = (term) => this.setState({ searchTerm: term });

  addToCart = async (product ) => {
    const { authToken } = this.state;
    if (!authToken) return;
    const existingItem = this.state.cart.find((i) => i.id === product.id);
    const newQty = existingItem ? existingItem.quantity + product.quantity : product.quantity;
    const updatedCart = existingItem
      ? this.state.cart.map((i) =>
          i.id === product.id ? { ...i, quantity: newQty } : i
        )
      : [...this.state.cart, { ...product, quantity: newQty }];

    this.setState({ cart: updatedCart });

    try {
      const res = await fetch('https://mobishaalaback-6.onrender.com/cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ productId: product.id, quantity: product.quantity }),
      });

      if (!res.ok) {
        throw new Error('Failed to add to cart');
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  incrementQuantity = async (id) => {
    const token = this.state.authToken;
    if (!token) return;
    const item = this.state.cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = item.quantity + 1;

    try {
      const res = await fetch(`https://mobishaalaback-6.onrender.com/cart/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) throw new Error('Failed to update quantity');
      this.setState((prevState) => ({
        cart: prevState.cart.map((i) =>
          i.id === id ? { ...i, quantity: newQty } : i
        ),
      }));
    } catch (err) {
      console.error('Sync failed:', err);
    }
  };

  decrementQuantity = async (id) => {
    const token = this.state.authToken;
    if (!token) return;
    const item = this.state.cart.find((i) => i.id === id);
    if (!item || item.quantity <= 1) return;
    const newQty = item.quantity - 1;

    try {
      const res = await fetch(`https://mobishaalaback-6.onrender.com/cart/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) throw new Error('Failed to update quantity');
      this.setState((prevState) => ({
        cart: prevState.cart.map((i) =>
          i.id === id ? { ...i, quantity: newQty } : i
        ),
      }));
    } catch (err) {
      console.error('Sync failed:', err);
    }
  };

  removeFromCart = async (id) => {
    const token = this.state.authToken;
    if (!token) return;
    try {
      const res = await fetch(`https://mobishaalaback-6.onrender.com/cart/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to remove item');
      this.setState((prevState) => ({
        cart: prevState.cart.filter((item) => item.id !== id),
      }));
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  };

  getTotal = () =>
    this.state.cart.reduce((total, i) => total + i.price * i.quantity, 0);

  clearCart = () => this.setState({ cart: [], cartLoaded: false });

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          setAuthToken: this.setAuthToken,
          setSearchTerm: this.setSearchTerm,
          addToCart: this.addToCart,
          removeFromCart: this.removeFromCart,
          incrementQuantity: this.incrementQuantity,
          decrementQuantity: this.decrementQuantity,
          loadCartFromServer: this.loadCartFromServer,
          loadOrdersFromServer: this.loadOrdersFromServer,
          getTotal: this.getTotal,
          clearCart: this.clearCart,
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export { AppContext, AppProvider };


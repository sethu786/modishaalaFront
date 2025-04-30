import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import { AppContext } from '../../context/AppContext';

import './index.css'; // Make sure this has the updated CSS below

class Login extends Component {
  state = {
    username: '',
    password: '',
    name: '',
    error: '',
    success: '',
    isSignup: false,
    redirectToHome: false,
  };

  static contextType = AppContext;

  handleLogin = async () => {
    const { username, password } = this.state;
    try {
      const response = await fetch('https://mobishaalaback-6.onrender.com/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        Cookie.set('jwt_token', data.jwtToken, { expires: 1 });
        this.context.setAuthToken(Cookie.get('jwt_token'));
        this.context.loadCartFromServer();
        this.context.loadOrdersFromServer();
        this.setState({ redirectToHome: true });
      } else {
        this.setState({ error: data.error });
      }
    } catch (err) {
      this.setState({ error: 'Network error. Try again later.' });
    }
  };

  handleSignup = async () => {
    const { username, password, name } = this.state;
    try {
      const response = await fetch('https://mobishaalaback-6.onrender.com/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name }),
      });

      const data = await response.json();
      if (response.ok) {
        this.setState({
          username,
          password,
          name: '',
          success: 'Registration successful. You can now log in.',
          error: '',
        });
      } else {
        this.setState({ error: data.error, success: '' });
      }
    } catch (err) {
      this.setState({ error: 'Network error. Try again later.' });
    }
  };

  toggleForm = () => {
    this.setState((prevState) => ({
      isSignup: !prevState.isSignup,
      error: '',
      success: '',
    }));
  };

  render() {
    const { username, password, name, error, success, isSignup, redirectToHome } = this.state;

    if (redirectToHome) {
      return <Navigate to="/" />;
    }

    return (
      <div className="auth-wrapper">
        <div className="auth-container">
          <h2>{isSignup ? 'Signup' : 'Login'}</h2>
          {isSignup && (
            <input
              type="text"
              value={name}
              placeholder="Name"
              onChange={(e) => this.setState({ name: e.target.value })}
            />
          )}
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => this.setState({ username: e.target.value })}
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => this.setState({ password: e.target.value })}
          />
          <button onClick={isSignup ? this.handleSignup : this.handleLogin}>
            {isSignup ? 'Signup' : 'Login'}
          </button>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <p className="toggle-link" onClick={this.toggleForm}>
            {isSignup
              ? 'Already have an account? Login here.'
              : 'Don’t have an account? Signup here.'}
          </p>
        </div>
      </div>
    );
  }
}

export default Login;

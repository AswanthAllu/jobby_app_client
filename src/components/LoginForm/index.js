// src/components/LoginForm/index.js
import {Component} from 'react';
import Cookies from 'js-cookie';
import {Navigate, Link} from 'react-router-dom';
import './index.css';

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  };

  onSubmitSuccess = data => {
    Cookies.set('jwt_token', data.jwt_token, {
      expires: 30,
      path: '/',
    });
    localStorage.setItem('user_info', JSON.stringify(data.user));

    const {user} = data;
    if (user && user.role === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/';
    }
  };

  onSubmitFailure = errorMsg => {
    // Let's provide a more generic error message for 404s
    const displayMsg = errorMsg || 'Network error. Please try again.';
    this.setState({showSubmitError: true, errorMsg: displayMsg});
  };

  onSubmitForm = async event => {
    event.preventDefault();
    const {username, password} = this.state;
    const userDetails = {username, password};
    
    // --- THIS IS THE LINE TO FIX ---
    // Ensure the URL is correct and uses the environment variable.
    const url = `${process.env.REACT_APP_API_URL}/api/auth/login`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        this.onSubmitSuccess(data);
      } else {
        // Use the error message from the backend if available
        this.onSubmitFailure(data.error_msg);
      }
    } catch (error) {
      // This catch block handles network errors like "Failed to fetch"
      console.error('Login fetch error:', error);
      this.onSubmitFailure('Network error. Please try again.');
    }
  };

  onEnterUsername = event => {
    this.setState({username: event.target.value});
  };

  onChangePassword = event => {
    this.setState({password: event.target.value});
  };

  renderUsername = () => {
    const {username} = this.state;
    return (
      <>
        <label className="label" htmlFor="userName">
          USERNAME (EMAIL)
        </label>
        <input
          type="text"
          id="userName"
          placeholder="Email"
          className="user-input"
          value={username}
          onChange={this.onEnterUsername}
        />
      </>
    );
  };

  renderPassword = () => {
    const {password} = this.state;
    return (
      <>
        <label className="label" htmlFor="password">
          PASSWORD
        </label>
        <input
          className="user-input"
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    );
  };

  render() {
    const {showSubmitError, errorMsg} = this.state;
    const jwtToken = Cookies.get('jwt_token');
    if (jwtToken !== undefined) {
      // Check user role for redirection if already logged in
      const userInfoString = localStorage.getItem('user_info');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
      if (userInfo && userInfo.role === 'admin') {
        return <Navigate to="/admin" />;
      }
      return <Navigate to="/" />;
    }

    return (
      <div className="jobby-app-container">
        <div className="card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <div className="input-container">{this.renderUsername()}</div>
            <div className="input-container">{this.renderPassword()}</div>
            <button className="login-button" type="submit">
              Login
            </button>
            {showSubmitError && <p className="error-msg">*{errorMsg}</p>}
            <p className="signup-link">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginForm;
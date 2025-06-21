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
    const displayMsg = errorMsg || 'Network error. Please try again.';
    this.setState({showSubmitError: true, errorMsg: displayMsg});
  };

  onSubmitForm = async event => {
    event.preventDefault();
    const {username, password} = this.state;
    const userDetails = {username, password};
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
        this.onSubmitFailure(data.error_msg);
      }
    } catch (error) {
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

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state;
    const jwtToken = Cookies.get('jwt_token');
    if (jwtToken !== undefined) {
      const userInfoString = localStorage.getItem('user_info');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
      if (userInfo && userInfo.role === 'admin') {
        return <Navigate to="/admin" />;
      }
      return <Navigate to="/" />;
    }

    return (
      <div className="login-page-container">
        <div className="login-form-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-website-logo"
          />
          <form className="login-form" onSubmit={this.onSubmitForm}>
            <div className="login-input-container">
              <label className="login-label" htmlFor="username">
                USERNAME (EMAIL)
              </label>
              <input
                type="text"
                id="username"
                className="login-user-input"
                placeholder="Email"
                value={username}
                onChange={this.onEnterUsername}
              />
            </div>
            <div className="login-input-container">
              <label className="login-label" htmlFor="password">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                className="login-user-input"
                placeholder="Password"
                value={password}
                onChange={this.onChangePassword}
              />
            </div>
            <button type="submit" className="login-form-button">
              Login
            </button>
            {showSubmitError && <p className="login-error-msg">*{errorMsg}</p>}
            <p className="signup-prompt">
              Don't have an account?{' '}
              <Link to="/signup" className="signup-link">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginForm;
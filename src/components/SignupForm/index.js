// src/components/SignupForm/index.js
import {Component} from 'react';
import Cookies from 'js-cookie';
import {Navigate, Link} from 'react-router-dom';
import './index.css'; // We will create this new CSS file

class SignupForm extends Component {
  state = {
    name: '',
    username: '', // This will be the email
    password: '',
    showSubmitError: false,
    errorMsg: '',
  };

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    });
    // We don't need to check for admin role on signup, just go to home
    window.location.href = '/';
  };

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg});
  };

  onSubmitForm = async event => {
    event.preventDefault();
    const {name, username, password} = this.state;
    const userDetails = {name, email: username, password};
    const url = `${process.env.REACT_APP_API_URL}/api/auth/register`;

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
        this.onSubmitSuccess(data.token);
      } else {
        this.onSubmitFailure(data.message);
      }
    } catch (error) {
      this.onSubmitFailure('Network error. Please try again.');
    }
  };

  onEnterName = event => {
    this.setState({name: event.target.value});
  };

  onEnterUsername = event => {
    this.setState({username: event.target.value});
  };

  onChangePassword = event => {
    this.setState({password: event.target.value});
  };

  render() {
    const {name, username, password, showSubmitError, errorMsg} = this.state;
    const jwtToken = Cookies.get('jwt_token');
    if (jwtToken !== undefined) {
      return <Navigate to="/" />;
    }

    return (
      <div className="signup-page-container">
        <div className="signup-form-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="signup-website-logo"
          />
          <form className="signup-form" onSubmit={this.onSubmitForm}>
            <div className="signup-input-container">
              <label className="signup-label" htmlFor="name">
                NAME
              </label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                className="signup-user-input"
                value={name}
                onChange={this.onEnterName}
              />
            </div>
            <div className="signup-input-container">
              <label className="signup-label" htmlFor="username">
                USERNAME (EMAIL)
              </label>
              <input
                type="text"
                id="username"
                placeholder="Email"
                className="signup-user-input"
                value={username}
                onChange={this.onEnterUsername}
              />
            </div>
            <div className="signup-input-container">
              <label className="signup-label" htmlFor="password">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="signup-user-input"
                value={password}
                onChange={this.onChangePassword}
              />
            </div>
            <button type="submit" className="signup-form-button">
              Sign Up
            </button>
            {showSubmitError && <p className="signup-error-msg">*{errorMsg}</p>}
            <p className="login-prompt">
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default SignupForm;
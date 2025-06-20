// src/components/SignupForm/index.js
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Navigate, Link} from 'react-router-dom' // UPDATED
import './index.css'

class SignupForm extends Component {
  state = {
    name: '',
    username: '', // This will be the email
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    window.location.href = "/" // Force reload
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {name, username, password} = this.state
    const userDetails = {name, email: username, password}
    const url = `${process.env.REACT_APP_API_URL}/api/auth/register`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.token)
    } else {
      this.onSubmitFailure(data.message)
    }
  }

  onEnterName = event => {
    this.setState({name: event.target.value})
  }

  onEnterUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {name, username, password, showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Navigate to="/" /> // UPDATED
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
            <div className="input-container">
              <label className="label" htmlFor="name">NAME</label>
              <input type="text" id="name" placeholder="Name" className="user-input" value={name} onChange={this.onEnterName} />
            </div>
            <div className="input-container">
              <label className="label" htmlFor="userName">USERNAME (EMAIL)</label>
              <input type="text" id="userName" placeholder="Email" className="user-input" value={username} onChange={this.onEnterUsername} />
            </div>
            <div className="input-container">
              <label className="label" htmlFor="password">PASSWORD</label>
              <input className="user-input" id="password" type="password" placeholder="Password" value={password} onChange={this.onChangePassword} />
            </div>
            <button className="login-button" type="submit">
              Sign Up
            </button>
            {showSubmitError && <p className="error-msg">*{errorMsg}</p>}
            <p className="signup-link">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    )
  }
}

export default SignupForm
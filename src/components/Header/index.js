// src/components/Header/index.js
import Cookies from 'js-cookie'
// UPDATED: Import useNavigate hook instead of withRouter
import {useNavigate, Link} from 'react-router-dom' 
import './index.css'

const Header = () => {
  // Get the navigate function from the hook
  const navigate = useNavigate() 

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    // Use the navigate function to redirect
    navigate('/login') 
  }

  return (
    <nav className="navbar-container">
      <div>
        <Link to="/" className="link-item">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </Link>
      </div>
      <ul className="header-list-items">
        <Link to="/" className="link-item">
          <li className="home-heading home">Home</li>
        </Link>
        <Link to="/jobs" className="link-item">
          <li className="jon-heading home">Jobs</li>
        </Link>
      </ul>
      <div>
        <button type="button" className="logout-button" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

// REMOVED: withRouter is no longer needed
export default Header
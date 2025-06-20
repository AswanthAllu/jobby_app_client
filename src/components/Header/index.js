// src/components/Header/index.js
import {useState} from 'react';
import {Link} from 'react-router-dom';
import {FaUserCircle} from 'react-icons/fa';
import Sidebar from '../Sidebar'; // <-- IMPORT THE NEW SIDEBAR
import './index.css';

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav className="header-nav-bar">
        <div className="header-content">
          <Link to="/" className="header-logo-link">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="header-website-logo"
            />
          </Link>

          {/* Desktop links remain the same */}
          <ul className="header-desktop-links">
            <li className="header-nav-item">
              <Link to="/" className="header-nav-link">Home</Link>
            </li>
            <li className="header-nav-item">
              <Link to="/jobs" className="header-nav-link">Jobs</Link>
            </li>
          </ul>

          <div className="header-profile-section">
            <button
              type="button"
              className="header-profile-button"
              onClick={() => setSidebarOpen(true)} // This now opens the sidebar
            >
              <FaUserCircle className="header-profile-icon" />
            </button>
          </div>
        </div>
      </nav>

      {/* The Sidebar is rendered here and controlled by state */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;
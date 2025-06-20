// src/components/Sidebar/index.js
import {useNavigate, Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import {IoMdClose} from 'react-icons/io';
import './index.css';

const Sidebar = ({isOpen, onClose}) => {
  const navigate = useNavigate();

  const onClickLogout = () => {
    onClose();
    Cookies.remove('jwt_token');
    localStorage.removeItem('user_info');
    navigate('/login');
  };

  const sidebarContainerClass = `sidebar-container ${isOpen ? 'open' : ''}`;

  return (
    <div className={sidebarContainerClass} onClick={onClose}>
      <div className="sidebar-content" onClick={e => e.stopPropagation()}>
        <button type="button" className="sidebar-close-button" onClick={onClose}>
          <IoMdClose />
        </button>
        
        {/* --- THIS IS THE SIMPLIFIED STRUCTURE --- */}
        <div className="sidebar-nav-items">
          <Link to="/" className="sidebar-link" onClick={onClose}>
            Home
          </Link>
          <button
            type="button"
            className="sidebar-logout-button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
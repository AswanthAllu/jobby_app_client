// src/components/AdminRoute/index.js
import {Navigate} from 'react-router-dom';
import Cookie from 'js-cookie';

const AdminRoute = ({children}) => {
  const token = Cookie.get('jwt_token');
  
  // Get user info from localStorage
  const userInfoString = localStorage.getItem('user_info');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  // Check for token AND if the user's role is 'admin'
  if (token === undefined || !userInfo || userInfo.role !== 'admin') {
    // If not an admin, redirect to the home page
    return <Navigate to="/" />;
  }

  // If they are an admin, render the component
  return children;
};

export default AdminRoute;
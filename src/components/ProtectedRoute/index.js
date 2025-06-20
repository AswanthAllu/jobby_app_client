// src/components/ProtectedRoute/index.js
import {Navigate} from 'react-router-dom';
import Cookie from 'js-cookie';

const ProtectedRoute = ({children}) => {
  const token = Cookie.get('jwt_token');

  if (token === undefined) {
    // Use <Navigate> for redirection in v6
    return <Navigate to="/login" />;
  }

  // If token exists, render the child component
  return children;
};

export default ProtectedRoute;
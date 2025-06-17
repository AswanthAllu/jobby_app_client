// src/components/ProtectedRoute/index.js
import {Navigate} from 'react-router-dom'
import Cookie from 'js-cookie'

// In v6, a protected route is a regular component that returns
// either the page content (<children>) or a <Navigate> element.
const ProtectedRoute = ({children}) => {
  const token = Cookie.get('jwt_token')
  if (token === undefined) {
    // If no token, redirect to the login page
    return <Navigate to="/login" />
  }
  // If there is a token, render the component that was passed in
  return children
}

export default ProtectedRoute
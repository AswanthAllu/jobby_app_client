// src/App.js
import {Route, Routes, Navigate} from 'react-router-dom' // UPDATED IMPORTS
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import Home from './components/Home'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import JobItemDetails from './components/JobItemDetails'
import Jobs from './components/Jobs'
import './App.css'

const App = () => (
  // UPDATED to use <Routes> instead of <Switch>
  <Routes> 
    <Route path="/login" element={<LoginForm />} />
    <Route path="/signup" element={<SignupForm />} />

    {/* Protected Routes are now wrapped this way */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />
    <Route
      path="/jobs"
      element={
        <ProtectedRoute>
          <Jobs />
        </ProtectedRoute>
      }
    />
    <Route
      path="/jobs/:id"
      element={
        <ProtectedRoute>
          <JobItemDetails />
        </ProtectedRoute>
      }
    />

    <Route path="/not-found" element={<NotFound />} />
    {/* UPDATED to use <Navigate> for redirection */}
    <Route path="*" element={<Navigate to="/not-found" />} /> 
  </Routes>
)

export default App
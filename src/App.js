// src/App.js
import {Route, Routes, Navigate} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Home from './components/Home';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import JobItemDetails from './components/JobItemDetails';
import Jobs from './components/Jobs';
import AdminDashboard from './components/AdminDashboard';

const App = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<LoginForm />} />
    <Route path="/signup" element={<SignupForm />} />
    <Route path="/not-found" element={<NotFound />} />

    {/* Protected Routes for All Users */}
    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
    <Route path="/jobs/:id" element={<ProtectedRoute><JobItemDetails /></ProtectedRoute>} />

    {/* Protected Route for Admins */}
    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

    {/* Catch-all Redirect */}
    <Route path="*" element={<Navigate to="/not-found" />} />
  </Routes>
);

export default App;
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GET_USER_SUCCESS } from '../../Redux/Auth/ActionTypes';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jwt = params.get('jwt');

    if (jwt) {
      // Save JWT to local storage
      localStorage.setItem('jwt', jwt);
      
      // We don't have the user profile yet, but we can signal success
      // The Navbar or App.jsx usually handles fetching profile if JWT exists
      
      // Redirect to home/dashboard
      navigate('/');
      
      // Optional: Force a page reload to ensure all components see the new JWT
      window.location.reload();
    } else {
      // If no JWT, something went wrong, go back to login
      navigate('/signin');
    }
  }, [location, navigate, dispatch]);

  return (
    <div className="h-screen flex items-center justify-center bg-bg-base">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-text-secondary animate-pulse">Completing secure login...</p>
      </div>
    </div>
  );
};

export default LoginSuccess;

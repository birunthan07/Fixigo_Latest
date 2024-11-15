// ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const [isSubscriptionValid, setIsSubscriptionValid] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkSubscriptionStatus = async () => {
        try {
          const { data } = await axios.get('http://localhost:5000/subscription-status');
          setIsSubscriptionValid(!data.isExpired);
          if (data.isExpired) {
            navigate('/payment');
          }
        } catch (error) {
          console.error('Subscription check failed:', error);
        }
      };
  
      checkSubscriptionStatus();
  
      const interval = setInterval(checkSubscriptionStatus, 1800000);
      return () => clearInterval(interval);
    }, [navigate]);
  
    return isSubscriptionValid === null ? null : isSubscriptionValid ? <Component {...rest} /> : null;
  };
  

export default ProtectedRoute;

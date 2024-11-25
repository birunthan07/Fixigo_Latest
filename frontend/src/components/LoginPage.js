


import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const colors = {
  primary: '#2a9df4',
  secondary: '#DBD5C7',
  accent: '#2a9df4',
  dark: '#000000',
  light: '#DBD5C7',
  white: '#FFFFFF',
  navy: '#153448',
};

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { token } = response.data;
      if (!token) throw new Error('Token not received');

      const decodedToken = jwtDecode(token);
      const role = decodedToken.user?.role;
      const name = decodedToken.user?.username;
      const userId = decodedToken.user?.id;

      if (!role) throw new Error('Role not found in token');

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', name);
      localStorage.setItem('userId', userId); 
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userRole', role);
      sessionStorage.setItem('userName', name);
      sessionStorage.setItem('userId', userId); 

      console.log('User ID:', userId); // Log userId to the console

      setSuccessMessage('Login successful!');
      setFormData({ email: '', password: '' });
      setErrors({});
      setServerError('');

      if (role === 'admin') navigate('/admin-dashboard');
      else if (role === 'user') navigate('/user-dashboard');
      else if (role === 'mechanic') navigate('/mechanic-dashboard');

    } catch (error) {
      console.error('Login Error:', error);
      if (error.response?.status === 400) {
        setServerError('Invalid email or password. Please try again.');
      } else {
        setServerError('Unexpected error occurred. Please try again later.');
      }
      setSuccessMessage('');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundImage: 'url(/bgImage.jpg)',  // Use the relative path from the public directory
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '20px',
    },

    formContainer: {
      backgroundColor: `rgba(255, 255, 255, 0.8)`,
      padding: '3rem',
      borderRadius: '20px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center',
    },
    title: {
      color: colors.navy,
      fontSize: '2.5rem',
      marginBottom: '2rem',
      fontWeight: '700',
    },
    inputGroup: {
      position: 'relative',
      marginBottom: '1.5rem',
    },
    input: {
      width: '80%',
      padding: '1rem 1rem 1rem 3rem',
      borderRadius: '50px',
      border: `2px solid ${colors.secondary}`,
      fontSize: '1rem',
      transition: 'border-color 0.3s ease',
      outline: 'none',
    },
    icon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: colors.primary,
      fontSize: '1.2rem',
    },
    button: {
      width: '100%',
      padding: '1rem',
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: '50px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    link: {
      color: colors.primary,
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'color 0.3s ease',
    },
    error: {
      color: '#ff4757',
      fontSize: '0.9rem',
      marginTop: '0.5rem',
      textAlign: 'left',
      paddingLeft: '1rem',
    },
    success: {
      color: '#2ed573',
      fontSize: '1rem',
      marginBottom: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Welcome Back!</h2>
        {serverError && <p style={styles.error}>{serverError}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <FaEnvelope style={styles.icon} />
            <input
              type="email"
              name="email"
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>
          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type="password"
              name="password"
              style={styles.input}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>
          <button 
            type="submit" 
            style={styles.button}
          >
            <FaSignInAlt style={{ marginRight: '0.5rem' }} />
            Login
          </button>
          <p style={{ marginTop: '1.5rem' }}>
            <Link 
              to="/register" 
              style={styles.link}
            >
              Don't have an account? Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}



import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaWrench, FaSignInAlt } from 'react-icons/fa';

const colors = {
  primary: '#2a9df4',
  secondary: '#DBD5C7',
  accent: '#2a9df4',
  dark: '#000000',
  light: '#DBD5C7',
  white: '#FFFFFF',
  navy: '#153448',
};

export default function MechanicLoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/mechanic/login', formData);
      const { mechanicId, token } = response.data;

      if (mechanicId && token) {
        localStorage.setItem('mechanicId', mechanicId);
        localStorage.setItem('token', token);
        
        setSuccessMessage('Login successful!');
        setFormData({ email: '', password: '' });
        setErrors({});
        setServerError('');

        navigate('/mechanic-dashboard');
      } else {
        setServerError('Missing mechanicId or token in response');
        setSuccessMessage('');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setServerError('Your account is not approved yet.');
      } else if (error.response?.status === 400) {
        setServerError('Invalid Credentials');
      } else {
        setServerError('An unexpected error occurred.');
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
      fontFamily: "'Roboto', sans-serif",
    },
    formContainer: {
      background: `rgba(255, 255, 255, 0.8)`,
      backdropFilter: 'blur(10px)',
      borderRadius: '10px',
      padding: '40px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    },
    title: {
      color: colors.navy,
      fontSize: '28px',
      textAlign: 'center',
      marginBottom: '30px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputGroup: {
      position: 'relative',
      marginBottom: '20px',
    },
    input: {
      width: '80%',
      padding: '12px 40px 12px 15px',
      fontSize: '16px',
      border: `2px solid ${colors.primary}`,
      borderRadius: '5px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    icon: {
      position: 'absolute',
      right: '30px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: colors.primary,
    },
    button: {
      width: '100%',
      padding: '12px',
      fontSize: '18px',
      color: colors.white,
      backgroundColor: colors.primary,
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    link: {
      display: 'block',
      textAlign: 'center',
      color: colors.primary,
      textDecoration: 'none',
      marginTop: '20px',
      fontSize: '14px',
    },
    error: {
      color: '#e74c3c',
      fontSize: '14px',
      marginTop: '5px',
    },
    success: {
      color: '#2ecc71',
      fontSize: '16px',
      textAlign: 'center',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>
          <FaWrench style={{ marginRight: '10px' }} />
          Mechanic Login
        </h2>
        {serverError && <p style={styles.error}>{serverError}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <FaEnvelope style={styles.icon} />
          </div>
          {errors.email && <p style={styles.error}>{errors.email}</p>}
          <div style={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <FaLock style={styles.icon} />
          </div>
          {errors.password && <p style={styles.error}>{errors.password}</p>}
          <button type="submit" style={styles.button}>
            <FaSignInAlt style={{ marginRight: '10px' }} />
            Login as Mechanic
          </button>
        </form>
        <Link to="/mechanic-register" style={styles.link}>
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
}

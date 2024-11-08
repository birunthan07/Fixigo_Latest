

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaUserPlus } from 'react-icons/fa';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
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

    setIsSubmitting(true);
    setServerError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log('Registration Successful:', response.data);
      setSuccessMessage('Registration successful! Redirecting to your dashboard...');
      setFormData({ username: '', email: '', password: '', phoneNumber: '', address: '' });
      setErrors({});
      setTimeout(() => navigate('/user-dashboard'), 2000);
    } catch (error) {
      console.error('Registration Error:', error);
      setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    },
    formContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '15px',
      padding: '40px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      width: '100%',
      maxWidth: '500px',
    },
    title: {
      color: '#4a5568',
      fontSize: '28px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
    },
    inputGroup: {
      marginBottom: '20px',
      position: 'relative',
    },
    input: {
      width: '80%',
      padding: '12px 20px 12px 45px',
      fontSize: '16px',
      border: '2px solid #cbd5e0',
      borderRadius: '8px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    inputFocus: {
      borderColor: '#667eea',
    },
    icon: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#a0aec0',
    },
    button: {
      width: '93%',
      padding: '12px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonHover: {
      backgroundColor: '#5a67d8',
    },
    link: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: 'bold',
      transition: 'color 0.3s ease',
    },
    linkHover: {
      color: '#5a67d8',
    },
    error: {
      color: '#e53e3e',
      fontSize: '14px',
      marginTop: '5px',
    },
    success: {
      color: '#38a169',
      fontSize: '16px',
      textAlign: 'center',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Join Us Today!</h2>
        {serverError && <p style={styles.error}>{serverError}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <FaUser style={styles.icon} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = styles.input.border.split(' ')[2]}
            />
            {errors.username && <p style={styles.error}>{errors.username}</p>}
          </div>
          <div style={styles.inputGroup}>
            <FaEnvelope style={styles.icon} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = styles.input.border.split(' ')[2]}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>
          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = styles.input.border.split(' ')[2]}
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>
          <div style={styles.inputGroup}>
            <FaPhone style={styles.icon} />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = styles.input.border.split(' ')[2]}
            />
            {errors.phoneNumber && <p style={styles.error}>{errors.phoneNumber}</p>}
          </div>
          <div style={styles.inputGroup}>
            <FaMapMarkerAlt style={styles.icon} />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
              onBlur={(e) => e.target.style.borderColor = styles.input.border.split(' ')[2]}
            />
            {errors.address && <p style={styles.error}>{errors.address}</p>}
          </div>
          <button
            type="submit"
            style={styles.button}
            disabled={isSubmitting}
            onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            <FaUserPlus style={{ marginRight: '10px' }} />
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link
            to="/login"
            style={styles.link}
            onMouseOver={(e) => e.target.style.color = styles.linkHover.color}
            onMouseOut={(e) => e.target.style.color = styles.link.color}
          >
            Already have an account? Login
          </Link>
        </p>
      </div>
    </div>
  );
}
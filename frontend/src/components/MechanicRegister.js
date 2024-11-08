// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaFileUpload } from 'react-icons/fa';

// export default function MechanicRegisterForm() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     phoneNumber: '',
//     address: '',
//     verificationCertificate: null,
//   });

//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.username.trim()) newErrors.username = 'Username is required';
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
//     if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
//     if (!formData.address.trim()) newErrors.address = 'Address is required';
//     if (!formData.verificationCertificate) newErrors.verificationCertificate = 'Verification certificate is required';
//     return newErrors;
//   };

//   const handleChange = (e) => {
//     if (e.target.files) {
//       setFormData({ ...formData, [e.target.name]: e.target.files[0] });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     const formDataToSend = new FormData();
//     Object.keys(formData).forEach(key => {
//       formDataToSend.append(key, formData[key]);
//     });

//     try {
//       const response = await axios.post('http://localhost:8000/api/mechanic/register', formDataToSend, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       console.log('Mechanic Registration Successful:', response.data);
//       setSuccessMessage('Registration successful! Your profile is under review.');
//       setFormData({
//         username: '',
//         email: '',
//         password: '',
//         phoneNumber: '',
//         address: '',
//         verificationCertificate: null,
//       });
//       setErrors({});
//       setServerError('');
//     } catch (error) {
//       setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
//       setSuccessMessage('');
//     }
//   };

//   const styles = {
//     container: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//       padding: '20px',
//     },
//     formContainer: {
//       backgroundColor: 'white',
//       borderRadius: '10px',
//       padding: '40px',
//       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//       width: '100%',
//       maxWidth: '500px',
//     },
//     title: {
//       textAlign: 'center',
//       color: '#4a5568',
//       marginBottom: '30px',
//       fontSize: '24px',
//       fontWeight: 'bold',
//     },
//     inputGroup: {
//       marginBottom: '20px',
//       position: 'relative',
//     },
//     input: {
//       width: '80%',
//       padding: '10px 15px 10px 40px',
//       borderRadius: '5px',
//       border: '1px solid #e2e8f0',
//       fontSize: '16px',
//       transition: 'border-color 0.3s ease',
//     },
//     icon: {
//       position: 'absolute',
//       left: '10px',
//       top: '50%',
//       transform: 'translateY(-50%)',
//       color: '#a0aec0',
//     },
//     fileInput: {
//       display: 'none',
//     },
//     fileLabel: {
//       display: 'flex',
//       alignItems: 'center',
//       padding: '10px 15px',
//       backgroundColor: '#edf2f7',
//       color: '#4a5568',
//       borderRadius: '5px',
//       cursor: 'pointer',
//       transition: 'background-color 0.3s ease',
//     },
//     button: {
//       width: '100%',
//       padding: '12px',
//       backgroundColor: '#4299e1',
//       color: 'white',
//       border: 'none',
//       borderRadius: '5px',
//       fontSize: '16px',
//       fontWeight: 'bold',
//       cursor: 'pointer',
//       transition: 'background-color 0.3s ease',
//     },
//     link: {
//       display: 'block',
//       textAlign: 'center',
//       marginTop: '20px',
//       color: '#4299e1',
//       textDecoration: 'none',
//     },
//     error: {
//       color: '#e53e3e',
//       fontSize: '14px',
//       marginTop: '5px',
//     },
//     success: {
//       color: '#38a169',
//       textAlign: 'center',
//       marginBottom: '20px',
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.formContainer}>
//         <h2 style={styles.title}>Mechanic Registration</h2>
//         {serverError && <p style={styles.error}>{serverError}</p>}
//         {successMessage && <p style={styles.success}>{successMessage}</p>}
//         <form onSubmit={handleSubmit}>
//           <div style={styles.inputGroup}>
//             <FaUser style={styles.icon} />
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               value={formData.username}
//               onChange={handleChange}
//               style={styles.input}
//               required
//             />
//             {errors.username && <p style={styles.error}>{errors.username}</p>}
//           </div>
//           <div style={styles.inputGroup}>
//             <FaEnvelope style={styles.icon} />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               style={styles.input}
//               required
//             />
//             {errors.email && <p style={styles.error}>{errors.email}</p>}
//           </div>
//           <div style={styles.inputGroup}>
//             <FaLock style={styles.icon} />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               style={styles.input}
//               required
//             />
//             {errors.password && <p style={styles.error}>{errors.password}</p>}
//           </div>
//           <div style={styles.inputGroup}>
//             <FaPhone style={styles.icon} />
//             <input
//               type="tel"
//               name="phoneNumber"
//               placeholder="Phone Number"
//               value={formData.phoneNumber}
//               onChange={handleChange}
//               style={styles.input}
//               required
//             />
//             {errors.phoneNumber && <p style={styles.error}>{errors.phoneNumber}</p>}
//           </div>
//           <div style={styles.inputGroup}>
//             <FaMapMarkerAlt style={styles.icon} />
//             <input
//               type="text"
//               name="address"
//               placeholder="Address"
//               value={formData.address}
//               onChange={handleChange}
//               style={styles.input}
//               required
//             />
//             {errors.address && <p style={styles.error}>{errors.address}</p>}
//           </div>
//           <div style={styles.inputGroup}>
//             <input
//               type="file"
//               id="verificationCertificate"
//               name="verificationCertificate"
//               onChange={handleChange}
//               style={styles.fileInput}
//               required
//             />
//             <label htmlFor="verificationCertificate" style={styles.fileLabel}>
//               <FaFileUpload style={{ marginRight: '10px' }} />
//               {formData.verificationCertificate ? formData.verificationCertificate.name : 'Upload Verification Certificate'}
//             </label>
//             {errors.verificationCertificate && <p style={styles.error}>{errors.verificationCertificate}</p>}
//           </div>
//           <button type="submit" style={styles.button}>
//             Register as Mechanic
//           </button>
//         </form>
//         <Link to="/mechanic-login" style={styles.link}>
//           Already registered? Login
//         </Link>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaFileUpload } from 'react-icons/fa';

export default function MechanicRegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    verificationCertificate: null,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.verificationCertificate) newErrors.verificationCertificate = 'Verification certificate is required';
    return newErrors;
  };

  const handleChange = (e) => {
    if (e.target.files) {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/mechanic/register', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Mechanic Registration Successful:', response.data);
      setSuccessMessage('Registration successful! Redirecting to payment page...');
      setErrors({});
      setServerError('');

      // Redirect to payment page after successful registration
      navigate('/payment'); // Ensure to navigate here
    } catch (error) {
      setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
      setSuccessMessage('');
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
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '40px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '500px',
    },
    title: {
      textAlign: 'center',
      color: '#4a5568',
      marginBottom: '30px',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    inputGroup: {
      marginBottom: '20px',
      position: 'relative',
    },
    input: {
      width: '80%',
      padding: '10px 15px 10px 40px',
      borderRadius: '5px',
      border: '1px solid #e2e8f0',
      fontSize: '16px',
      transition: 'border-color 0.3s ease',
    },
    icon: {
      position: 'absolute',
      left: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#a0aec0',
    },
    fileInput: {
      display: 'none',
    },
    fileLabel: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 15px',
      backgroundColor: '#edf2f7',
      color: '#4a5568',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#4299e1',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    link: {
      display: 'block',
      textAlign: 'center',
      marginTop: '20px',
      color: '#4299e1',
      textDecoration: 'none',
    },
    error: {
      color: '#e53e3e',
      fontSize: '14px',
      marginTop: '5px',
    },
    success: {
      color: '#38a169',
      textAlign: 'center',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Mechanic Registration</h2>
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
              style={styles.input}
              required
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
              style={styles.input}
              required
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
              style={styles.input}
              required
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>
          <div style={styles.inputGroup}>
            <FaPhone style={styles.icon} />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              style={styles.input}
              required
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
              style={styles.input}
              required
            />
            {errors.address && <p style={styles.error}>{errors.address}</p>}
          </div>
          <div style={styles.inputGroup}>
            <input
              type="file"
              id="verificationCertificate"
              name="verificationCertificate"
              onChange={handleChange}
              style={styles.fileInput}
              required
            />
            <label htmlFor="verificationCertificate" style={styles.fileLabel}>
              <FaFileUpload style={{ marginRight: '10px' }} />
              {formData.verificationCertificate ? formData.verificationCertificate.name : 'Upload Verification Certificate'}
            </label>
            {errors.verificationCertificate && <p style={styles.error}>{errors.verificationCertificate}</p>}
          </div>
          <button type="submit" style={styles.button}>
            Register as Mechanic
          </button>
        </form>
        <Link to="/mechanic-login" style={styles.link}>
          Already registered? Login
        </Link>
      </div>
    </div>
  );
}

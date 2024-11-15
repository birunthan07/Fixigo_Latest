



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { io } from 'socket.io-client';
// import { FaToggleOn, FaToggleOff, FaMapMarkerAlt, FaTools, FaClipboardList, FaMoneyBillWave, FaBox } from 'react-icons/fa';

// const socket = io('http://localhost:5000');

// // Placeholder components - replace these with your actual components
// const CompletedRepairs = () => <div>Completed Repairs Component</div>;
// const MechanicRequests = () => <div>Mechanic Requests Component</div>;
// const PaymentInfo = () => <div>Payment Info Component</div>;

// export default function MechanicDashboard() {
//   const [isAvailable, setIsAvailable] = useState(false);
//   const [location, setLocation] = useState({ latitude: null, longitude: null });
//   const [locationError, setLocationError] = useState('');
//   const [packages, setPackages] = useState([]);

//   const toggleAvailability = () => {
//     if (!isAvailable) {
//       getLiveLocation();
//     } else {
//       setLocation({ latitude: null, longitude: null });
//       updateMechanicStatus(null, null, false);
//     }
//     setIsAvailable(!isAvailable);
//   };

//   const getLiveLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ latitude, longitude });
//           setLocationError('');
//           updateMechanicStatus(latitude, longitude, true);
//         },
//         (error) => {
//           setLocationError('Unable to retrieve location. Please enable location services.');
//           console.error('Geolocation error:', error);
//         }
//       );
//     } else {
//       setLocationError('Geolocation is not supported by this browser.');
//     }
//   };
  
//   const updateMechanicStatus = async (latitude, longitude, isAvailable) => {
//     try {
//         const token = localStorage.getItem('token');
//         const mechanicId = localStorage.getItem('mechanicId');

//         if (!token || !mechanicId) {
//             throw new Error('Authorization token or mechanic ID is missing');
//         }

//         const liveLocation = (latitude !== undefined && longitude !== undefined) ? {
//             coordinates: [latitude, longitude] // Format for GeoJSON
//         } : null;

//         const response = await axios.post(
//             'http://localhost:5000/api/mechanic/update-availability',
//             {
//                 mechanicId,
//                 isAvailable,
//                 liveLocation
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );

//         console.log('Mechanic status updated:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error updating mechanic status:', error);
//     }
// };

  

//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('Socket connected:', socket.id);
//     });

//     axios.get('http://localhost:5000/api/packages')
//       .then(response => setPackages(response.data))
//       .catch(error => console.error('Error fetching packages:', error));

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const styles = {
//     container: {
//       maxWidth: '1200px',
//       margin: '0 auto',
//       padding: '20px',
//       fontFamily: 'Arial, sans-serif',
//       backgroundColor: '#f0f4f8',
//       borderRadius: '10px',
//       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//     },
//     header: {
//       fontSize: '2.5rem',
//       color: '#2c3e50',
//       textAlign: 'center',
//       marginBottom: '30px',
//     },
//     button: {
//       backgroundColor: isAvailable ? '#e74c3c' : '#2ecc71',
//       color: 'white',
//       border: 'none',
//       padding: '10px 20px',
//       fontSize: '1rem',
//       borderRadius: '5px',
//       cursor: 'pointer',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       transition: 'background-color 0.3s ease',
//     },
//     buttonIcon: {
//       marginRight: '10px',
//     },
//     locationError: {
//       color: '#e74c3c',
//       marginTop: '10px',
//     },
//     locationInfo: {
//       backgroundColor: '#3498db',
//       color: 'white',
//       padding: '10px',
//       borderRadius: '5px',
//       marginTop: '10px',
//     },
//     section: {
//       backgroundColor: 'white',
//       padding: '20px',
//       borderRadius: '8px',
//       marginTop: '20px',
//       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//     },
//     sectionTitle: {
//       fontSize: '1.5rem',
//       color: '#34495e',
//       marginBottom: '15px',
//       display: 'flex',
//       alignItems: 'center',
//     },
//     sectionIcon: {
//       marginRight: '10px',
//       color: '#3498db',
//     },
//     packageList: {
//       listStyle: 'none',
//       padding: 0,
//     },
//     packageItem: {
//       backgroundColor: '#ecf0f1',
//       padding: '15px',
//       borderRadius: '5px',
//       marginBottom: '10px',
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//     },
//     packageName: {
//       fontWeight: 'bold',
//       color: '#2c3e50',
//     },
//     packageDescription: {
//       color: '#7f8c8d',
//     },
//     packagePrice: {
//       color: '#27ae60',
//       fontWeight: 'bold',
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.header}>Mechanic Dashboard</h1>
//       <button onClick={toggleAvailability} style={styles.button}>
//         {isAvailable ? <FaToggleOn style={styles.buttonIcon} /> : <FaToggleOff style={styles.buttonIcon} />}
//         {isAvailable ? 'Set as Unavailable' : 'Set as Available'}
//       </button>
//       {locationError && <p style={styles.locationError}>{locationError}</p>}
//       {isAvailable && location.latitude && location.longitude && (
//         <p style={styles.locationInfo}>
//           <FaMapMarkerAlt /> Current Location: Latitude {location.latitude}, Longitude {location.longitude}
//         </p>
//       )}
      
//       <div style={styles.section}>
//         <h2 style={styles.sectionTitle}>
//           <FaTools style={styles.sectionIcon} /> Completed Repairs
//         </h2>
//         <CompletedRepairs />
//       </div>
      
//       <div style={styles.section}>
//         <h2 style={styles.sectionTitle}>
//           <FaClipboardList style={styles.sectionIcon} /> Mechanic Requests
//         </h2>
//         <MechanicRequests />
//       </div>
      
//       <div style={styles.section}>
//         <h2 style={styles.sectionTitle}>
//           <FaMoneyBillWave style={styles.sectionIcon} /> Payment Information
//         </h2>
//         <PaymentInfo />
//       </div>

//       <div style={styles.section}>
//         <h2 style={styles.sectionTitle}>
//           <FaBox style={styles.sectionIcon} /> Available Packages
//         </h2>
//         <ul style={styles.packageList}>
//           {packages.map(pkg => (
//             <li key={pkg._id} style={styles.packageItem}>
//               <div>
//                 <span style={styles.packageName}>{pkg.name}</span>
//                 <p style={styles.packageDescription}>{pkg.description}</p>
//               </div>
//               <span style={styles.packagePrice}>${pkg.price}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import {
  FaToggleOn,
  FaToggleOff,
  FaMapMarkerAlt,
  FaTools,
  FaClipboardList,
  FaMoneyBillWave,
  FaBox,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaWrench,
  FaChevronRight
} from 'react-icons/fa';

const socket = io('http://localhost:5000');

const CompletedRepairs = ({ onRepairClick }) => (
  <div style={{ display: 'grid', gap: '1rem' }}>
    {[1, 2, 3].map((repair) => (
      <button
        key={repair}
        onClick={() => onRepairClick(repair)}
        style={{
          backgroundColor: '#153448',
          padding: '1.5rem',
          borderRadius: '8px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          width: '100%',
          textAlign: 'left'
        }}
      >
        <FaCheckCircle size={24} style={{ color: '#2a9df4' }} />
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Repair #{repair}</h3>
          <p style={{ margin: 0, color: '#D4D4D4', fontSize: '0.9rem' }}>Completed on March {repair + 10}, 2024</p>
        </div>
        <FaChevronRight style={{ marginLeft: 'auto', color: '#2a9df4' }} />
      </button>
    ))}
  </div>
);

const MechanicRequests = () => (
  <div style={{ display: 'grid', gap: '1rem' }}>
    {[1, 2].map((request) => (
      <div
        key={request}
        style={{
          backgroundColor: '#153448',
          padding: '1.5rem',
          borderRadius: '8px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <FaClock size={24} style={{ color: '#2a9df4' }} />
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Service Request #{request}</h3>
          <p style={{ margin: 0, color: '#D4D4D4', fontSize: '0.9rem' }}>Pending approval</p>
        </div>
      </div>
    ))}
  </div>
);

const PaymentInfo = ({ onPaymentClick }) => (
  <div style={{ display: 'grid', gap: '1rem' }}>
    <button
      onClick={() => onPaymentClick('total')}
      style={{
        backgroundColor: '#153448',
        padding: '1.5rem',
        borderRadius: '8px',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        width: '100%',
        textAlign: 'left'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Total Earnings</h3>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$1,234.56</span>
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div>
          <p style={{ color: '#D4D4D4', margin: '0 0 0.25rem 0' }}>This Week</p>
          <span style={{ fontSize: '1.1rem' }}>$345.00</span>
        </div>
        <div>
          <p style={{ color: '#D4D4D4', margin: '0 0 0.25rem 0' }}>This Month</p>
          <span style={{ fontSize: '1.1rem' }}>$892.50</span>
        </div>
      </div>
      <FaChevronRight style={{ marginLeft: 'auto', color: '#2a9df4', position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)' }} />
    </button>
  </div>
);

export default function MechanicDashboard() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationError, setLocationError] = useState('');
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();


  const toggleAvailability = () => {
    if (!isAvailable) {
      getLiveLocation();
    } else {
      setLocation({ latitude: null, longitude: null });
      updateMechanicStatus(null, null, false);
    }
    setIsAvailable(!isAvailable);
  };

  const getLiveLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setLocationError('');
          updateMechanicStatus(latitude, longitude, true);
        },
        (error) => {
          setLocationError('Unable to retrieve location. Please enable location services.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  const updateMechanicStatus = async (latitude, longitude, isAvailable) => {
    try {
      const token = localStorage.getItem('token');
      const mechanicId = localStorage.getItem('mechanicId');

      if (!token || !mechanicId) {
        throw new Error('Authorization token or mechanic ID is missing');
      }

      const liveLocation = latitude !== undefined && longitude !== undefined
        ? { coordinates: [latitude, longitude] }
        : null;

      const response = await axios.post(
        'http://localhost:5000/api/mechanic/update-availability',
        {
          mechanicId,
          isAvailable,
          liveLocation
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Mechanic status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating mechanic status:', error);
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    axios.get('http://localhost:5000/api/packages')
      .then(response => setPackages(response.data))
      .catch(error => console.error('Error fetching packages:', error));

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleRepairClick = (repairId) => {
    console.log(`Navigating to repair details for Repair #${repairId}`);
    navigate(`/repairs/${repairId}`); // Navigates to the repair details page with the specific repair ID
  };

  const handlePaymentClick = (paymentType) => {
    console.log(`Navigating to payment details for ${paymentType}`);
    navigate(`/payments/${paymentType}`); // Navigates to the payment details page with the specific payment type
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: 'black',
      minHeight: '100vh',
      color: 'white',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2rem',
      padding: '1.5rem',
      backgroundColor: '#153448',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    headerIcon: {
      fontSize: '2rem',
      color: '#2a9df4',
    },
    headerText: {
      margin: 0,
      fontSize: '1.8rem',
      fontWeight: 'bold',
    },
    statusSection: {
      backgroundColor: '#153448',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '2rem',
    },
    button: {
      backgroundColor: isAvailable ? '#2a9df4' : '#153448',
      color: 'white',
      border: `2px solid ${isAvailable ? '#2a9df4' : '#D4D4D4'}`,
      padding: '1rem 1.5rem',
      fontSize: '1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease',
      fontWeight: 'bold',
    },
    locationError: {
      color: '#D4D4D4',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: '1rem',
      borderRadius: '8px',
      marginTop: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    locationInfo: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: '1rem',
      borderRadius: '8px',
      marginTop: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#D4D4D4',
    },
    grid: {
      display: 'grid',
      gap: '2rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    },
    section: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      padding: '1.5rem',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)',
    },
    sectionTitle: {
      fontSize: '1.3rem',
      color: 'white',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    sectionIcon: {
      color: '#2a9df4',
    },
    packageList: {
      display: 'grid',
      gap: '1rem',
      padding: 0,
      margin: 0,
      listStyle: 'none',
    },
    packageItem: {
      backgroundColor: '#153448',
      padding: '1.5rem',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'transform 0.2s ease, background-color 0.3s ease',
      cursor: 'pointer',
      ':hover': {
        transform: 'translateY(-2px)',
        backgroundColor: '#1c4259',
      },
    },
    packageInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    packageName: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: 'white',
      margin: 0,
    },
    packageDescription: {
      color: '#D4D4D4',
      margin: 0,
      fontSize: '0.9rem',
    },
    packagePrice: {
      color: '#2a9df4',
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <FaWrench style={styles.headerIcon} />
        <h1 style={styles.headerText}>Mechanic Dashboard</h1>
      </header>

      <div style={styles.statusSection}>
        <button onClick={toggleAvailability} style={styles.button}>
          {isAvailable ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
          {isAvailable ? 'Set as Unavailable' : 'Set as Available'}
        </button>
        
        {locationError && (
          <div style={styles.locationError}>
            <FaMapMarkerAlt />
            {locationError}
          </div>
        )}
        
        {isAvailable && location.latitude && location.longitude && (
          <div style={styles.locationInfo}>
            <FaMapMarkerAlt />
            Current Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </div>
        )}
      </div>

      <div style={styles.grid}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaTools style={styles.sectionIcon} />
            Completed Repairs
          </h2>
          <CompletedRepairs onRepairClick={handleRepairClick} />
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaClipboardList style={styles.sectionIcon} />
            Mechanic Requests
          </h2>
          <MechanicRequests />
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaMoneyBillWave style={styles.sectionIcon} />
            Payment Information
          </h2>
          <PaymentInfo onPaymentClick={handlePaymentClick} />
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaBox style={styles.sectionIcon} />
            Available Packages
          </h2>
          <ul style={styles.packageList}>
            {packages.map((pkg, index) => (
              <li key={pkg._id || index} style={styles.packageItem}>
                <div style={styles.packageInfo}>
                  <h3 style={styles.packageName}>{pkg.name}</h3>
                  <p style={styles.packageDescription}>{pkg.description}</p>
                </div>
                <span style={styles.packagePrice}>${pkg.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
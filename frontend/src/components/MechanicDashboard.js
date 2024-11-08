

// import React, { useState, useEffect } from 'react';
// import CompletedRepairs from './CompletedRepairs';
// import MechanicRequests from './MechanicRequests';
// import PaymentInfo from './PaymentInfo';
// import axios from 'axios';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:8000');

// const MechanicDashboard = () => {
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

//   const updateMechanicStatus = async (latitude, longitude, availability) => {
//     try {
//       await axios.post('http://localhost:8000/api/mechanics/status', {
//         latitude,
//         longitude,
//         availability,
//       });
//     } catch (error) {
//       console.error('Error updating mechanic status:', error);
//     }
//   };

//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('Socket connected:', socket.id);
//     });

//     axios.get('http://localhost:8000/api/packages')
//       .then(response => setPackages(response.data))
//       .catch(error => console.error('Error fetching packages:', error));

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <h1>Mechanic Dashboard</h1>
//       <button onClick={toggleAvailability}>
//         {isAvailable ? 'Set as Unavailable' : 'Set as Available'}
//       </button>
//       {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
//       {isAvailable && location.latitude && location.longitude && (
//         <p>Current Location: Latitude {location.latitude}, Longitude {location.longitude}</p>
//       )}
//       <CompletedRepairs />
//       <MechanicRequests />
//       <PaymentInfo />

//       <h3>Available Packages</h3>
//       <ul>
//         {packages.map(pkg => (
//           <li key={pkg._id}>
//             <strong>{pkg.name}</strong>: {pkg.description} - ${pkg.price}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MechanicDashboard;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { FaToggleOn, FaToggleOff, FaMapMarkerAlt, FaTools, FaClipboardList, FaMoneyBillWave, FaBox } from 'react-icons/fa';

const socket = io('http://localhost:5000');

// Placeholder components - replace these with your actual components
const CompletedRepairs = () => <div>Completed Repairs Component</div>;
const MechanicRequests = () => <div>Mechanic Requests Component</div>;
const PaymentInfo = () => <div>Payment Info Component</div>;

export default function MechanicDashboard() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationError, setLocationError] = useState('');
  const [packages, setPackages] = useState([]);

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

<<<<<<< HEAD
=======
  
>>>>>>> cf94cd5 (db)

  const updateMechanicStatus = async (latitude, longitude, isAvailable) => {
    try {
        const token = localStorage.getItem('token'); // Retrieve the token
        const mechanicId = "672790273a1a29b580a80f61"; // Replace with dynamic mechanicId as needed

        await axios.post(
            'http://localhost:5000/api/mechanic/update-availability',
            {
                mechanicId,
                isAvailable,
                liveLocation: latitude && longitude ? {
                    coordinates: [latitude, longitude]
                } : null
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
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

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f4f8',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      textAlign: 'center',
      marginBottom: '30px',
    },
    button: {
      backgroundColor: isAvailable ? '#e74c3c' : '#2ecc71',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      fontSize: '1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.3s ease',
    },
    buttonIcon: {
      marginRight: '10px',
    },
    locationError: {
      color: '#e74c3c',
      marginTop: '10px',
    },
    locationInfo: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      marginTop: '10px',
    },
    section: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginTop: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      color: '#34495e',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
    },
    sectionIcon: {
      marginRight: '10px',
      color: '#3498db',
    },
    packageList: {
      listStyle: 'none',
      padding: 0,
    },
    packageItem: {
      backgroundColor: '#ecf0f1',
      padding: '15px',
      borderRadius: '5px',
      marginBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    packageName: {
      fontWeight: 'bold',
      color: '#2c3e50',
    },
    packageDescription: {
      color: '#7f8c8d',
    },
    packagePrice: {
      color: '#27ae60',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Mechanic Dashboard</h1>
      <button onClick={toggleAvailability} style={styles.button}>
        {isAvailable ? <FaToggleOn style={styles.buttonIcon} /> : <FaToggleOff style={styles.buttonIcon} />}
        {isAvailable ? 'Set as Unavailable' : 'Set as Available'}
      </button>
      {locationError && <p style={styles.locationError}>{locationError}</p>}
      {isAvailable && location.latitude && location.longitude && (
        <p style={styles.locationInfo}>
          <FaMapMarkerAlt /> Current Location: Latitude {location.latitude}, Longitude {location.longitude}
        </p>
      )}
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <FaTools style={styles.sectionIcon} /> Completed Repairs
        </h2>
        <CompletedRepairs />
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <FaClipboardList style={styles.sectionIcon} /> Mechanic Requests
        </h2>
        <MechanicRequests />
        <button>mechanic request</button>
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <FaMoneyBillWave style={styles.sectionIcon} /> Payment Information
        </h2>
        <PaymentInfo />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <FaBox style={styles.sectionIcon} /> Available Packages
        </h2>
        <ul style={styles.packageList}>
          {packages.map(pkg => (
            <li key={pkg._id} style={styles.packageItem}>
              <div>
                <span style={styles.packageName}>{pkg.name}</span>
                <p style={styles.packageDescription}>{pkg.description}</p>
              </div>
              <span style={styles.packagePrice}>${pkg.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
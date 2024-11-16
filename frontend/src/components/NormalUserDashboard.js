
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import config from '../config';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaCar, FaMotorcycle, FaTruck, FaSearch, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

// Fix for default marker icon issue with Leaflet and Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function UserDashboard() {
  const [location, setLocation] = useState('');
  const [locationCoords, setLocationCoords] = useState(null);
  const [userLocationMarker, setUserLocationMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState([9.6615, 80.0255]);
  const [suggestions, setSuggestions] = useState([]);
  const [vehicleType, setVehicleType] = useState('Car');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState(null); // State to track selected mechanic

  const rapidApiKey = config.RAPIDAPI_KEY;

  const requestOptions = useMemo(() => ({
    method: 'GET',
    headers: new Headers({
      'x-rapidapi-key': rapidApiKey,
      'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
      'Accept': 'application/json',
    }),
    redirect: 'follow',
  }), [rapidApiKey]);

  const geocode = useCallback(async (latlng) => {
    const url = `https://google-map-places.p.rapidapi.com/maps/api/geocode/json?latlng=${latlng[0]},${latlng[1]}&language=en&region=en`;
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 403) {
          throw new Error("Access forbidden. Check API key or RapidAPI subscription.");
        }
        throw new Error(`Error geocoding location: ${response.statusText}`);
      }
      const result = await response.json();
      if (result?.results?.length > 0) {
        setLocation(result.results[0].formatted_address);
      } else {
        setErrorMessage("No results found for the location.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [requestOptions]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocationMarker([latitude, longitude]);
          const latlng = [latitude, longitude];
          setLocationCoords(latlng);
          geocode(latlng);
          try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (token && userId) {
              await axios.post(
                'http://localhost:5000/api/auth/update-location',
                { userId, latitude, longitude },
                { headers: { Authorization: `Bearer ${token}` } }
              );
            }
          } catch (error) {
            console.error('Error updating live location:', error);
          }
        },
        (error) => {
          setLocation('Unable to fetch location.');
        }
      );
    }
  }, [geocode]);

  const handleSearchMechanics = async () => {
    if (!locationCoords) {
      setErrorMessage('Please allow location access to search for nearby mechanics.');
      return;
    }
    if (!vehicleType) {
      setErrorMessage('Please select a vehicle type.');
      return;
    }
    setLoadingSuggestions(true);
    setErrorMessage('');
    try {
      const mechanicsApiUrl = `http://localhost:5000/api/mechanic/search`;
      const response = await fetch(
        `${mechanicsApiUrl}?lat=${encodeURIComponent(locationCoords[0])}&lng=${encodeURIComponent(locationCoords[1])}&vehicleType=${encodeURIComponent(vehicleType)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error fetching mechanics: ${errorData.message || response.statusText}`);
      }
      const data = await response.json();
      setSuggestions(data.mechanics);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to search for mechanics.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    if (locationCoords) {
      setMapCenter(locationCoords);
    }
  }, [locationCoords]);

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
    searchSection: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      color: '#34495e',
      fontWeight: 'bold',
    },
    select: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      borderRadius: '5px',
      border: '1px solid #bdc3c7',
      fontSize: '16px',
    },
    button: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.3s ease',
    },
    mapContainer: {
      height: '400px',
      width: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    mechanicCard: {
      padding: '20px',
      marginTop: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    mechanicCardHeader: {
      fontSize: '1.5rem',
      marginBottom: '10px',
    },
    mechanicCardDetails: {
      fontSize: '1.2rem',
      color: '#34495e',
    },
  };

  const selectMechanic = (mechanic) => {
    setSelectedMechanic(mechanic);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>User Dashboard</h1>
      <div style={styles.searchSection}>
        <label style={styles.label}>
          <FaMapMarkerAlt /> Location: {location || 'Fetching your location...'}
        </label>
        {errorMessage && <p style={{ color: '#e74c3c' }}>{errorMessage}</p>}
        <label style={styles.label}>
          Vehicle Type:
          <select 
            value={vehicleType} 
            onChange={(e) => setVehicleType(e.target.value)}
            style={styles.select}
          >
            <option value="Car">Car</option>
            <option value="Motorbike">Motorbike</option>
            <option value="Truck">Truck</option>
            <option value="other">other</option>
          </select>
        </label>
        <button 
          onClick={handleSearchMechanics} 
          disabled={!locationCoords}
          style={styles.button}
        >
          {loadingSuggestions ? <FaSpinner className="spinner" /> : <FaSearch />} 
          Search Nearby Mechanics
        </button>
      </div>

      <div style={styles.mapContainer}>
        <MapContainer center={mapCenter} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {userLocationMarker && (
            <Marker position={userLocationMarker}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          {suggestions.map((mechanic) => (
            <Marker 
              key={mechanic._id} 
              position={[mechanic.location.coordinates[1], mechanic.location.coordinates[0]]}
              onClick={() => selectMechanic(mechanic)}
            >
              <Popup>{mechanic.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedMechanic && (
        <div style={styles.mechanicCard}>
          <h3 style={styles.mechanicCardHeader}>{selectedMechanic.name}</h3>
          <p style={styles.mechanicCardDetails}>Phone: {selectedMechanic.phoneNumber}</p>
          <p style={styles.mechanicCardDetails}>Service Type: {selectedMechanic.serviceType}</p>
        </div>
      )}
    </div>
  );
}




// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import config from '../config';
// import 'leaflet/dist/leaflet.css';
// import { FaMapMarkerAlt, FaCar, FaMotorcycle, FaTruck, FaSearch, FaSpinner } from 'react-icons/fa';
// import axios from 'axios';

// // Fix for default marker icon issue with Leaflet and Webpack
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// export default function UserDashboard() {
//   const [location, setLocation] = useState('');
//   const [locationCoords, setLocationCoords] = useState(null);
//   const [userLocationMarker, setUserLocationMarker] = useState(null);
//   const [mapCenter, setMapCenter] = useState([9.6615, 80.0255]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [mechanics, setMechanics] = useState([]); // Mechanics live locations
//   const [vehicleType, setVehicleType] = useState('Car');
//   const [loadingSuggestions, setLoadingSuggestions] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [selectedMechanic, setSelectedMechanic] = useState(null); // State to track selected mechanic

//   const rapidApiKey = config.RAPIDAPI_KEY;

//   const requestOptions = useMemo(() => ({
//     method: 'GET',
//     headers: new Headers({
//       'x-rapidapi-key': rapidApiKey,
//       'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
//       'Accept': 'application/json',
//     }),
//     redirect: 'follow',
//   }), [rapidApiKey]);

//   const geocode = useCallback(async (latlng) => {
//     const url = `https://google-map-places.p.rapidapi.com/maps/api/geocode/json?latlng=${latlng[0]},${latlng[1]}&language=en&region=en`;
//     try {
//       const response = await fetch(url, requestOptions);
//       if (!response.ok) {
//         throw new Error(`Error geocoding location: ${response.statusText}`);
//       }
//       const result = await response.json();
//       if (result?.results?.length > 0) {
//         setLocation(result.results[0].formatted_address);
//       } else {
//         setErrorMessage("No results found for the location.");
//       }
//     } catch (error) {
//       setErrorMessage(error.message);
//     }
//   }, [requestOptions]);

//   const fetchMechanics = useCallback(async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/mechanic/live-locations'); // Update to match your backend route
//       setMechanics(response.data.mechanics || []);
//     } catch (error) {
//       console.error('Error fetching mechanics live locations:', error);
//       setErrorMessage('Failed to fetch mechanics data.');
//     }
//   }, []);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           setUserLocationMarker([latitude, longitude]);
//           const latlng = [latitude, longitude];
//           setLocationCoords(latlng);
//           geocode(latlng);
//           try {
//             const token = localStorage.getItem('token');
//             const userId = localStorage.getItem('userId');
//             if (token && userId) {
//               await axios.post(
//                 'http://localhost:5000/api/auth/update-location',
//                 { userId, latitude, longitude },
//                 { headers: { Authorization: `Bearer ${token}` } }
//               );
//             }
//             fetchMechanics(); // Fetch mechanics once location is updated
//           } catch (error) {
//             console.error('Error updating live location:', error);
//           }
//         },
//         (error) => {
//           setLocation('Unable to fetch location.');
//         }
//       );
//     }
//   }, [geocode, fetchMechanics]);

//   const handleSearchMechanics = async () => {
//     if (!locationCoords) {
//       setErrorMessage('Please allow location access to search for nearby mechanics.');
//       return;
//     }
//     if (!vehicleType) {
//       setErrorMessage('Please select a vehicle type.');
//       return;
//     }
//     setLoadingSuggestions(true);
//     setErrorMessage('');
//     try {
//       const mechanicsApiUrl = `http://localhost:5000/api/mechanic/search`;
//       const response = await fetch(
//         `${mechanicsApiUrl}?lat=${encodeURIComponent(locationCoords[0])}&lng=${encodeURIComponent(locationCoords[1])}&vehicleType=${encodeURIComponent(vehicleType)}`,
//         {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`Error fetching mechanics: ${errorData.message || response.statusText}`);
//       }
//       const data = await response.json();
//       setSuggestions(data.mechanics);
//     } catch (error) {
//       setErrorMessage(error.message || 'Failed to search for mechanics.');
//     } finally {
//       setLoadingSuggestions(false);
//     }
//   };

//   useEffect(() => {
//     if (locationCoords) {
//       setMapCenter(locationCoords);
//     }
//   }, [locationCoords]);

//   const styles = {
//     // Same styles as provided
//   };

//   const selectMechanic = (mechanic) => {
//     setSelectedMechanic(mechanic);
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.header}>User Dashboard</h1>
//       <div style={styles.searchSection}>
//         <label style={styles.label}>
//           <FaMapMarkerAlt /> Location: {location || 'Fetching your location...'}
//         </label>
//         {errorMessage && <p style={{ color: '#e74c3c' }}>{errorMessage}</p>}
//         <label style={styles.label}>
//           Vehicle Type:
//           <select 
//             value={vehicleType} 
//             onChange={(e) => setVehicleType(e.target.value)}
//             style={styles.select}
//           >
//             <option value="Car">Car</option>
//             <option value="Motorbike">Motorbike</option>
//             <option value="Truck">Truck</option>
//             <option value="other">other</option>
//           </select>
//         </label>
//         <button 
//           onClick={handleSearchMechanics} 
//           disabled={!locationCoords}
//           style={styles.button}
//         >
//           {loadingSuggestions ? <FaSpinner className="spinner" /> : <FaSearch />} 
//           Search Nearby Mechanics
//         </button>
//       </div>

//       <div style={styles.mapContainer}>
//         <MapContainer center={mapCenter} zoom={14} style={{ height: '100%', width: '100%' }}>
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           {userLocationMarker && (
//             <Marker position={userLocationMarker}>
//               <Popup>Your Location</Popup>
//             </Marker>
//           )}
//           {mechanics.map((mechanic) => (
//             <Marker 
//               key={mechanic._id} 
//               position={[mechanic.liveLocation.coordinates[1], mechanic.liveLocation.coordinates[0]]}
//               onClick={() => selectMechanic(mechanic)}
//             >
//               <Popup>{mechanic.username} - {mechanic.vehicleType}</Popup>
//             </Marker>
//           ))}
//         </MapContainer>
//       </div>

//       {selectedMechanic && (
//         <div style={styles.mechanicCard}>
//           <h3 style={styles.mechanicCardHeader}>{selectedMechanic.name}</h3>
//           <p style={styles.mechanicCardDetails}>Phone: {selectedMechanic.phoneNumber}</p>
//           <p style={styles.mechanicCardDetails}>Service Type: {selectedMechanic.serviceType}</p>
//         </div>
//       )}
//     </div>
//   );
// }

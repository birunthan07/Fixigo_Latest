import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import config from '../config';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaCar, FaMotorcycle, FaTruck, FaSearch, FaSpinner } from 'react-icons/fa';

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
  const [mapCenter, setMapCenter] = useState([9.6615, 80.0255]); // Default center
  const [suggestions, setSuggestions] = useState([]);
  const [vehicleType, setVehicleType] = useState('Car');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
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
        console.error("Fetch error:", errorText);
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
      console.error("Error geocoding location:", error);
      setErrorMessage(error.message);
    }
  }, [requestOptions]);

  const useUserLocation = (geocodeFn, setLocationFn, setLocationCoordsFn) => {
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log('Fetched location:', { latitude, longitude });
            const latlng = [latitude, longitude];
            setLocationCoordsFn(latlng);
            geocodeFn(latlng);
          },
          (error) => {
            console.error('Error fetching location:', error);
            setLocationFn('Unable to fetch location.');
          }
        );
      }
    }, [geocodeFn, setLocationCoordsFn, setLocationFn]);
  };

  useUserLocation(geocode, setLocation, setLocationCoords);

  const handleSearchMechanics = async () => {
    if (!locationCoords) {
      setErrorMessage('Please allow location access to search for nearby mechanics.');
      return;
    }

    setLoadingSuggestions(true);
    setErrorMessage('');

    try {
      const mechanicsApiUrl = `http://localhost:5000/api/mechanic/search`;

      const response = await fetch(
        `${mechanicsApiUrl}?lat=${locationCoords[0]}&lng=${locationCoords[1]}&vehicleType=${vehicleType}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching mechanics: ${response.statusText}`);
      }
      console.log(`Fetching mechanics from: ${mechanicsApiUrl}?lat=${locationCoords[0]}&lng=${locationCoords[1]}&vehicleType=${vehicleType}`);

      const data = await response.json();
      setSuggestions(data.mechanics);
    } catch (error) {
      console.error('Error searching mechanics:', error);
      setErrorMessage('Failed to search for mechanics.');
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
    buttonHover: {
      backgroundColor: '#2980b9',
    },
    mapContainer: {
      height: '400px',
      width: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    errorMessage: {
      color: '#e74c3c',
      marginTop: '10px',
    },
    loadingMessage: {
      textAlign: 'center',
      color: '#3498db',
      marginTop: '20px',
      fontSize: '18px',
    },
    noMechanicsMessage: {
      textAlign: 'center',
      color: '#7f8c8d',
      marginTop: '20px',
      fontSize: '18px',
    },
    icon: {
      marginRight: '8px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>User Dashboard</h1>
      <div style={styles.searchSection}>
        <label style={styles.label}>
          <FaMapMarkerAlt style={styles.icon} />
          Location: {location || 'Fetching your location...'}
        </label>
        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        <label style={styles.label}>
          Vehicle Type:
          <select 
            value={vehicleType} 
            onChange={(e) => setVehicleType(e.target.value)}
            style={styles.select}
          >
            <option value="Car">Car</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Truck">Truck</option>
          </select>
        </label>
        <button 
          onClick={handleSearchMechanics} 
          disabled={!locationCoords}
          style={styles.button}
          onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          <FaSearch style={styles.icon} />
          Search Mechanics
        </button>
      </div>

      <div style={styles.mapContainer}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {suggestions.map((mechanic) => (
            <Marker key={mechanic._id} position={[mechanic.location.latitude, mechanic.location.longitude]}>
              <Popup>{mechanic.name} - {mechanic.serviceType}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {loadingSuggestions && (
        <p style={styles.loadingMessage}>
          <FaSpinner style={{ ...styles.icon, animation: 'spin 1s linear infinite' }} />
          Loading mechanics...
        </p>
      )}
      {suggestions.length === 0 && !loadingSuggestions && (
        <p style={styles.noMechanicsMessage}>No mechanics found nearby.</p>
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
//   const [mapCenter, setMapCenter] = useState([9.6615, 80.0255]); // Default center
//   const [suggestions, setSuggestions] = useState([]);
//   const [vehicleType, setVehicleType] = useState('Car');
//   const [loadingSuggestions, setLoadingSuggestions] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

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
//       if (!response.ok) throw new Error(`Error geocoding location: ${response.statusText}`);

//       const result = await response.json();
//       if (result?.results?.length > 0) {
//         setLocation(result.results[0].formatted_address);
//       } else {
//         setErrorMessage("No results found for the location.");
//       }
//     } catch (error) {
//       console.error("Error geocoding location:", error);
//       setErrorMessage(error.message);
//     }
//   }, [requestOptions]);

//   const useUserLocation = (geocodeFn, setLocationFn, setLocationCoordsFn) => {
//     useEffect(() => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords;
//             const latlng = [latitude, longitude];
//             setLocationCoordsFn(latlng);
//             geocodeFn(latlng);
//           },
//           (error) => {
//             console.error('Error fetching location:', error);
//             setLocationFn('Unable to fetch location.');
//           }
//         );
//       }
//     }, [geocodeFn, setLocationCoordsFn, setLocationFn]);
//   };

//   useUserLocation(geocode, setLocation, setLocationCoords);

//   const handleSearchMechanics = async () => {
//     if (!locationCoords) {
//       setErrorMessage('Please allow location access to search for nearby mechanics.');
//       return;
//     }

//     setLoadingSuggestions(true);
//     setErrorMessage('');

//     try {
//       const mechanicsApiUrl = `http://localhost:5000/api/auth/search`;

//       const response = await fetch(
//         `${mechanicsApiUrl}?lat=${locationCoords[0]}&lng=${locationCoords[1]}&vehicleType=${vehicleType}`,
//         {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );

//       if (!response.ok) throw new Error(`Error fetching mechanics: ${response.statusText}`);

//       const data = await response.json();
//       setSuggestions(data.mechanics || []);
//     } catch (error) {
//       console.error('Error searching mechanics:', error);
//       setErrorMessage('Failed to search for mechanics.');
//     } finally {
//       setLoadingSuggestions(false);
//     }
//   };

//   useEffect(() => {
//     if (locationCoords) setMapCenter(locationCoords);
//   }, [locationCoords]);

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
//     searchSection: {
//       backgroundColor: 'white',
//       borderRadius: '8px',
//       padding: '20px',
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '10px',
//     },
//     input: {
//       padding: '10px',
//       fontSize: '1rem',
//       borderRadius: '5px',
//       border: '1px solid #ccc',
//     },
//     searchButton: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px',
//       padding: '10px 20px',
//       fontSize: '1.2rem',
//       backgroundColor: '#3498db',
//       color: 'white',
//       border: 'none',
//       borderRadius: '5px',
//       cursor: 'pointer',
//       alignSelf: 'center',
//     },
//     mapContainer: {
//       height: '600px',
//       borderRadius: '10px',
//       overflow: 'hidden',
//     },
//     errorMessage: {
//       color: 'red',
//       fontSize: '1rem',
//       textAlign: 'center',
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.header}>Find Nearby Mechanics</h2>

//       <div style={styles.searchSection}>
//         <label>Vehicle Type</label>
//         <select
//           style={styles.input}
//           value={vehicleType}
//           onChange={(e) => setVehicleType(e.target.value)}
//         >
//           <option value="Car">Car</option>
//           <option value="Motorcycle">Motorcycle</option>
//           <option value="Truck">Truck</option>
//         </select>

//         <button style={styles.searchButton} onClick={handleSearchMechanics}>
//           {loadingSuggestions ? <FaSpinner className="spin" /> : <FaSearch />}
//           {loadingSuggestions ? 'Searching...' : 'Search Mechanics'}
//         </button>

//         {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
//       </div>

//       <MapContainer center={mapCenter} zoom={12} style={styles.mapContainer}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
//         />
//         {suggestions.map((mechanic) => (
//           <Marker
//             key={mechanic._id}
//             position={[mechanic.liveLocation.coordinates[1], mechanic.liveLocation.coordinates[0]]}
//           >
//             <Popup>
//               <h3>{mechanic.username}</h3>
//               <p>Phone: {mechanic.phoneNumber}</p>
//               <p>Vehicle Type: {mechanic.vehicleTypesServiced}</p>
//               <button>Request Service</button>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// }

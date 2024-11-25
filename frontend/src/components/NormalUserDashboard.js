import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import config from '../config';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaCar, FaMotorcycle, FaTruck, FaSearch, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [suggestions, setSuggestions] = useState([]); // Default to empty array
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
      setSuggestions(data.mechanics || []); // Ensure it defaults to an empty array if no mechanics
    } catch (error) {
      setErrorMessage(error.message || 'Failed to search for mechanics.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSendRequest = async (mechanic) => {
    try {
      console.log("Initiating request for mechanic:", mechanic); // Debug log for mechanic details
  
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
  
      if (!token || !userId) {
        console.log("Authentication error: Missing token or userId"); // Debug log for authentication failure
        toast.error('User not authenticated.');
        return;
      }
  
      console.log("Token and userId retrieved:", { token, userId }); // Debug log for retrieved token and userId
  
      const response = await axios.post(
        'http://localhost:5000/api/mechanic/send-request',
        { userId, mechanicEmail: mechanic.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Response from server:", response); // Debug log for server response
  
      if (response.status === 201) {
        toast.success('Request sent successfully!');
      }
    } catch (error) {
      console.error('Error sending request:', error); // Log the error details
      if (error.response) {
        console.error('Error response data:', error.response.data); // Log server response errors
      }
      toast.error('Failed to send request. Please try again.');
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
    handleSendRequest(mechanic);
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
            <option value="motorbike">motorbike</option>
            <option value="Truck">Truck</option>
          </select>
        </label>
        <button onClick={handleSearchMechanics} style={styles.button}>
          {loadingSuggestions ? <FaSpinner className="fa-spin" /> : <FaSearch />}
          Search Mechanics
        </button>
      </div>

      {suggestions.map((mechanic, index) => (
        <div
          key={index}
          onClick={() => selectMechanic(mechanic)}
          style={styles.mechanicCard}
        >
          <h3 style={styles.mechanicCardHeader}>{mechanic.username}</h3>
          <p style={styles.mechanicCardDetails}>
            <strong>Email:</strong> {mechanic.email}
          </p>
          <p style={styles.mechanicCardDetails}>
            <strong>Verification Certificate:</strong> <a href={mechanic.verificationCertificate} target="_blank" rel="noopener noreferrer">View Certificate</a>
          </p>
          {/* Added Select button */}
          <button
            onClick={(e) => {
              console.log("Select button clicked for mechanic:", mechanic); // Debug log for button click
              e.stopPropagation(); // Prevent event bubbling
              handleSendRequest(mechanic); // Call the request function
            }}
            style={styles.button}
          >
            Select
          </button>

        </div>
      ))}

      <MapContainer center={mapCenter} zoom={13} style={styles.mapContainer}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocationMarker && <Marker position={userLocationMarker}><Popup>Your Location</Popup></Marker>}
        {suggestions.map((mechanic, index) => (
          mechanic.liveLocation && (
            <Marker key={index} position={[mechanic.liveLocation.coordinates[1], mechanic.liveLocation.coordinates[0]]}>
              <Popup>{mechanic.username}</Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );

}








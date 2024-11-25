

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const MechanicRequests = () => {
//   const [mechanicRequests, setMechanicRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         // Replace with your API endpoint
//         const response = await axios.get('http://localhost:000/api/mechanic-requests');
//         setMechanicRequests(response.data); // Assuming the response data is an array
//       } catch (err) {
//         setError('Failed to fetch mechanic requests. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, []);

//   const handleAccept = async (id) => {
//     try {
//       // Logic to accept the service request (e.g., API call)
//       await axios.post(`http://localhost:5000/api/service-requests/${id}/accept`);
//       alert(`Service request with ID ${id} accepted`);
//       setMechanicRequests(mechanicRequests.filter((request) => request.id !== id)); // Remove after accepting
//     } catch (error) {
//       alert('Failed to accept the service request.');
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       // Logic to reject the service request (e.g., API call)
//       await axios.post(`http://localhost:5000/api/service-requests/${id}/reject`);
//       alert(`Service request with ID ${id} rejected`);
//       setMechanicRequests(mechanicRequests.filter((request) => request.id !== id)); // Remove after rejecting
//     } catch (error) {
//       alert('Failed to reject the service request.');
//     }
//   };

//   if (loading) return <div>Loading requests...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="mechanic-requests-section">
//       <h2>Service Requests</h2>
//       <ul>
//         {mechanicRequests.map((request) => (
//           <li key={request.id}>
//             Customer: {request.customer}, Service: {request.service}, Location: {request.location}
//             <button onClick={() => handleAccept(request.id)}>Accept</button>
//             <button onClick={() => handleReject(request.id)}>Reject</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MechanicRequests;




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MechanicRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/mechanic/mechanic-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data.requests);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to fetch mechanic requests.');
      setLoading(false);
    }
  };

  const handleRequestUpdate = async (requestId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        'http://localhost:5000/api/mechanic/update-request',
        { requestId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      fetchRequests(); // Refresh the list after update
    } catch (err) {
      console.error('Error updating request:', err);
      toast.error('Failed to update request. Please try again.');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <div>Loading mechanic requests...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h2>Mechanic Requests</h2>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div style={styles.requestList}>
          {requests.map((request) => (
            <div key={request._id} style={styles.requestCard}>
              <h4>User Details</h4>
              <p><strong>Name:</strong> {request.user?.username || 'N/A'}</p>
              <p><strong>Email:</strong> {request.user?.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {request.user?.phone || 'N/A'}</p>
              <p><strong>Address:</strong> {request.user?.address || 'N/A'}</p>
              <h4>Request Details</h4>
              <p><strong>Status:</strong> {request.status || 'Pending'}</p>
              <div style={styles.buttonGroup}>
                {request.status === 'Pending' && (
                  <>
                    <button
                      style={{ ...styles.button, backgroundColor: 'green' }}
                      onClick={() => handleRequestUpdate(request._id, 'Accepted')}
                    >
                      Accept
                    </button>
                    <button
                      style={{ ...styles.button, backgroundColor: 'red' }}
                      onClick={() => handleRequestUpdate(request._id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Inline Styles
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  requestList: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  requestCard: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
  },
  buttonGroup: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
  },
  button: {
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default MechanicRequestsPage;

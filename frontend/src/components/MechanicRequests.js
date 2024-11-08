// // src/components/MechanicRequests.js
// import React, { useState } from 'react';

// const MechanicRequests = () => {
//   const [mechanicRequests, setMechanicRequests] = useState([
//     { id: 1, customer: 'Alice Johnson', service: 'Oil Change', location: '123 Elm St' },
//     { id: 2, customer: 'Bob Brown', service: 'Tire Rotation', location: '456 Maple Ave' },
//     { id: 3, customer: 'Charlie Green', service: 'Brake Replacement', location: '789 Oak Dr' }
//   ]);

//   const handleAccept = (id) => {
//     // Logic to accept the service request (e.g., API call)
//     alert(`Service request with ID ${id} accepted`);
//     setMechanicRequests(mechanicRequests.filter((request) => request.id !== id)); // Remove after accepting
//   };

//   const handleReject = (id) => {
//     // Logic to reject the service request (e.g., API call)
//     alert(`Service request with ID ${id} rejected`);
//     setMechanicRequests(mechanicRequests.filter((request) => request.id !== id)); // Remove after rejecting
//   };

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


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MechanicRequests = () => {
  const [mechanicRequests, setMechanicRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Replace with your API endpoint
        const response = await axios.get('http://localhost:8000/api/mechanic-requests');
        setMechanicRequests(response.data); // Assuming the response data is an array
      } catch (err) {
        setError('Failed to fetch mechanic requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      // Logic to accept the service request (e.g., API call)
      await axios.post(`http://localhost:5000/api/service-requests/${id}/accept`);
      alert(`Service request with ID ${id} accepted`);
      setMechanicRequests(mechanicRequests.filter((request) => request.id !== id)); // Remove after accepting
    } catch (error) {
      alert('Failed to accept the service request.');
    }
  };

  const handleReject = async (id) => {
    try {
      // Logic to reject the service request (e.g., API call)
      await axios.post(`http://localhost:5000/api/service-requests/${id}/reject`);
      alert(`Service request with ID ${id} rejected`);
      setMechanicRequests(mechanicRequests.filter((request) => request.id !== id)); // Remove after rejecting
    } catch (error) {
      alert('Failed to reject the service request.');
    }
  };

  if (loading) return <div>Loading requests...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mechanic-requests-section">
      <h2>Service Requests</h2>
      <ul>
        {mechanicRequests.map((request) => (
          <li key={request.id}>
            Customer: {request.customer}, Service: {request.service}, Location: {request.location}
            <button onClick={() => handleAccept(request.id)}>Accept</button>
            <button onClick={() => handleReject(request.id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MechanicRequests;


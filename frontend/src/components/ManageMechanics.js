


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function ManageMechanics() {
//   const [mechanics, setMechanics] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');

//   // Fetch the list of mechanics when the component loads
//   useEffect(() => {
//     fetchMechanics();
//   }, []);

//   // Fetch mechanics function
//   const fetchMechanics = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No token found, please log in.');
//       }

//       const response = await axios.get('http://localhost:5000/api/admin/mechanics', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMechanics(response.data);
//     } catch (err) {
//       console.error('Error fetching mechanics:', err);
//       setError(err.response?.data?.msg || err.message || 'Error fetching mechanics');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAction = async (action, mechanicId) => {
//     try {
//       setError(null);
//       setSuccessMessage('');
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No token found, please log in.');
//       }

//       console.log(`Performing action: ${action} on mechanic with ID: ${mechanicId}`);

//       let response;
//       if (action === 'delete') {
//         // Ensure the URL is correct here
//         console.log(`Sending DELETE request for mechanic ID: ${mechanicId}`);

//         response = await axios.delete(
//           `http://localhost:5000/api/admin/mechanic/${mechanicId}`, // Ensure this is the correct path
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       } else if (action === 'approve') {
//         response = await axios.patch(
//           `http://localhost:5000/api/admin/mechanic/${mechanicId}/approve`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       } else if (action === 'reject') {
//         response = await axios.patch(
//           `http://localhost:5000/api/admin/mechanic/${mechanicId}/reject`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }

//       console.log(`Action ${action} successful: ${response.data.msg}`);
//       setSuccessMessage(response.data.msg);
//       fetchMechanics(); // Refresh mechanic list
//     } catch (err) {
//       console.error(`Error performing ${action}:`, err);
//       setError(err.response?.data?.msg || err.message || `Error performing ${action}`);
//     }
//   };

//   if (loading) return <p>Loading mechanics...</p>;

//   return (
//     <div style={{ padding: '1rem' }}>
//       <h2>Manage Mechanics</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      
//       <ul>
//         {mechanics.length ? (
//           mechanics.map((mechanic) => (
//             <li key={mechanic._id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd' }}>
//               <p><strong>{mechanic.name}</strong> ({mechanic.email})</p>
//               <p>Status: {mechanic.isApproved ? 'Approved' : 'Pending'}</p>
//               <p>Payment Status: {mechanic.paymentStatus || 'Not Available'}</p> {/* Add payment status */}
//               <div>
//                 <button onClick={() => handleAction(mechanic.isApproved ? 'reject' : 'approve', mechanic._id)}>
//                   {mechanic.isApproved ? 'Reject' : 'Approve'}
//                 </button>
//                 <button onClick={() => handleAction('delete', mechanic._id)} style={{ marginLeft: '1rem', backgroundColor: '#f44336', color: 'white' }}>
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))
//         ) : (
//           <p>No mechanics found</p>
//         )}
//       </ul>
//     </div>
//   );
// }

// export default ManageMechanics;





import React, { useState, useEffect } from 'react';
import axios from 'axios';

const colors = {
  primary: '#2a9df4',
  secondary: '#DBD5C7',
  accent: '#2a9df4',
  dark: '#ffffff',
  light: '#153448',
  white: '#FFFFFF',
};

function ManageMechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

      const response = await axios.get('http://localhost:5000/api/admin/mechanics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMechanics(response.data);
    } catch (err) {
      console.error('Error fetching mechanics:', err);
      setError(err.response?.data?.msg || err.message || 'Error fetching mechanics');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, mechanicId) => {
    try {
      setError(null);
      setSuccessMessage('');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

      console.log(`Performing action: ${action} on mechanic with ID: ${mechanicId}`);

      let response;
      if (action === 'delete') {
        console.log(`Sending DELETE request for mechanic ID: ${mechanicId}`);
        response = await axios.delete(
          `http://localhost:5000/api/admin/mechanic/${mechanicId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (action === 'approve') {
        response = await axios.patch(
          `http://localhost:5000/api/admin/mechanic/${mechanicId}/approve`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (action === 'reject') {
        response = await axios.patch(
          `http://localhost:5000/api/admin/mechanic/${mechanicId}/reject`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      console.log(`Action ${action} successful: ${response.data.msg}`);
      setSuccessMessage(response.data.msg);
      fetchMechanics();
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      setError(err.response?.data?.msg || err.message || `Error performing ${action}`);
    }
  };

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: colors.primary,
    }}>
      Loading mechanics...
    </div>
  );

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: colors.white,
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: "#000000",
        borderBottom: `2px solid ${colors.primary}`,
        paddingBottom: '0.5rem',
      }}>
        Manage Mechanics
      </h2>
      {error && (
        <p style={{
          backgroundColor: '#ff6b6b',
          color: colors.white,
          padding: '1rem',
          borderRadius: '0.25rem',
          marginBottom: '1rem',
        }}>
          {error}
        </p>
      )}
      {successMessage && (
        <p style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '1rem',
          borderRadius: '0.25rem',
          marginBottom: '1rem',
        }}>
          {successMessage}
        </p>
      )}
      
      {mechanics.length ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {mechanics.map((mechanic) => (
            <div key={mechanic._id} style={{
              backgroundColor: colors.light,
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                color: colors.dark,
              }}>
                {mechanic.name}
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: colors.dark,
                marginBottom: '0.5rem',
              }}>
                {mechanic.email}
              </p>
              <p style={{
                fontSize: '0.9rem',
                color: mechanic.isApproved ? '#28a745' : '#ffc107',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}>
                Status: {mechanic.isApproved ? 'Approved' : 'Pending'}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
              }}>
                <button
                  onClick={() => handleAction(mechanic.isApproved ? 'reject' : 'approve', mechanic._id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: mechanic.isApproved ? '#2a9df4' : '#28a745',
                    color: colors.white,
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease-in-out',
                  }}
                >
                  {mechanic.isApproved ? 'Reject' : 'Approve'}
                </button>
                <button
                  onClick={() => handleAction('delete', mechanic._id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc3545',
                    color: colors.white,
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease-in-out',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{
          fontSize: '1.1rem',
          color: colors.dark,
          textAlign: 'center',
          marginTop: '2rem',
        }}>
          No mechanics found
        </p>
      )}
    </div>
  );
}

export default ManageMechanics;

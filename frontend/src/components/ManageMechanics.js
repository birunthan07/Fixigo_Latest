import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageMechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch the list of mechanics when the component loads
  useEffect(() => {
    fetchMechanics();
  }, []);

  // Fetch mechanics function
  const fetchMechanics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

<<<<<<< HEAD
      const response = await axios.get('http://localhost:8000/api/admin/mechanics', {
        headers: { Authorization: `Bearer ${token}` },
=======
      const response = await axios.get('http://localhost:5000/api/admin/mechanics', {
        headers: { Authorization: `Bearer ${token}` }
>>>>>>> cf94cd5 (db)
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
  
      let response;
      if (action === 'delete') {
        response = await axios.delete(
          `http://localhost:5000/api/admin/mechanics/${mechanicId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Make sure action is either 'approve' or 'reject'
        response = await axios.patch(
<<<<<<< HEAD
          `http://localhost:8000/api/admin/mechanics/${mechanicId}/${action}`,
          {}, // Assuming no body is needed
=======
          `http://localhost:5000/api/admin/mechanics/${mechanicId}/${action}`,
          {},
>>>>>>> cf94cd5 (db)
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
  
      setSuccessMessage(response.data.msg);
      fetchMechanics(); // Refresh mechanic list
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      setError(err.response?.data?.msg || err.message || `Error performing ${action}`);
    }
  };
  
  if (loading) return <p>Loading mechanics...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Manage Mechanics</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      
      <ul>
        {mechanics.length ? (
          mechanics.map((mechanic) => (
            <li key={mechanic._id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd' }}>
              <p><strong>{mechanic.name}</strong> ({mechanic.email})</p>
              <p>Status: {mechanic.isApproved ? 'Approved' : 'Pending'}</p>
              <div>
                <button onClick={() => handleAction(mechanic.isApproved ? 'reject' : 'approve', mechanic._id)}>
                  {mechanic.isApproved ? 'Reject' : 'Approve'}
                </button>
                <button onClick={() => handleAction('delete', mechanic._id)} style={{ marginLeft: '1rem', backgroundColor: '#f44336', color: 'white' }}>
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No mechanics found</p>
        )}
      </ul>
    </div>
  );
}

export default ManageMechanics;

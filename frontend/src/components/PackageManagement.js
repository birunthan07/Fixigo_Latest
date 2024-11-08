// PackageManagement Component (import this into AdminDashboard)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ name: '', description: '', price: 0 });

  // Fetch existing packages on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/packages')
      .then(response => setPackages(response.data))
      .catch(error => console.error('Error fetching packages:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPackage({ ...newPackage, [name]: value });
  };

  const addPackage = () => {
    axios.post('http://localhost:5000/api/packages', newPackage)
      .then(response => {
        setPackages([...packages, response.data]);
        setNewPackage({ name: '', description: '', price: 0 });
      })
      .catch(error => console.error('Error adding package:', error));
  };

  return (
    <div>
      <h3>Manage Packages</h3>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Package Name"
          value={newPackage.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Package Description"
          value={newPackage.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newPackage.price}
          onChange={handleInputChange}
        />
        <button onClick={addPackage}>Add Package</button>
      </div>

      <h4>Available Packages</h4>
      <ul>
        {packages.map(pkg => (
          <li key={pkg._id}>
            <strong>{pkg.name}</strong>: {pkg.description} - ${pkg.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PackageManagement;

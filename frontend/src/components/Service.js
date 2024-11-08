// src/components/Service.js
import React from 'react';
import PaymentInfo from './PaymentInfo';
import CompletedRepairs from './CompletedRepairs';
import MechanicRequests from '../components/MechanicRequests'; // Import the MechanicRequests component

const Service = () => {
  return (
    <div className="service-container">
      <h1>Service Dashboard</h1>

      {/* Add the MechanicRequests component */}
      <MechanicRequests />
      
      {/* Add the PaymentInfo component */}
      <PaymentInfo />
      {/* Add the CompletedRepairs component */}
      <CompletedRepairs />
    </div>
  );
};

export default Service;

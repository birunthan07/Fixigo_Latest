// src/components/CompletedRepairs.js
import React from 'react';

const CompletedRepairs = () => {
  const completedRepairs = [
    { id: 1, service: 'Oil Change', distance: 'N/A', earnings: '$20' },
    { id: 2, service: 'Brake Replacement', distance: 'N/A', earnings: '$35' },
    { id: 3, service: 'Tire Rotation', distance: 'N/A', earnings: '$15' },
  ];

  return (
    <div className="completed-repairs-section">
      <h2>Completed Repairs</h2>
      <ul>
        {completedRepairs.map((repair) => (
          <li key={repair.id}>
            Service: {repair.service}, Earnings: {repair.earnings}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedRepairs;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUsers, FaMoneyBillWave, FaWrench, FaSignOutAlt, FaCheckCircle, FaBan, FaUserCog, FaClipboardList, FaTachometerAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const [mechanics, setMechanics] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMechanics: 0,
    totalRequests: 0,
    totalPayments: 0
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/mechanics')
      .then(response => setMechanics(response.data))
      .catch(error => console.error('Error fetching mechanics:', error));

    axios.get('http://localhost:5000/api/admin/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));

    axios.get('http://localhost:5000/api/admin/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  const approveMechanic = (mechanicId) => {
    axios.patch(`http://localhost:5000/api/admin/mechanic/${mechanicId}/approve`)
      .then(response => {
        setMechanics(mechanics.map(mechanic =>
          mechanic._id === mechanicId ? { ...mechanic, isApproved: true } : mechanic
        ));
        alert('Mechanic approved successfully!');
      })
      .catch(error => console.error('Error approving mechanic:', error));
  };

  const toggleBanUser = (userId) => {
    axios.patch(`http://localhost:5000/api/admin/user/${userId}/ban`)
      .then(response => {
        setUsers(users.map(user =>
          user._id === userId ? { ...user, isBanned: !user.isBanned } : user
        ));
        alert(response.data.msg);
      })
      .catch(error => console.error('Error toggling ban:', error));
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: "'Roboto', sans-serif",
    },
    sidebar: {
      width: '250px',
      backgroundColor: '#1a237e',
      color: 'white',
      padding: '20px',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
    },
    sidebarTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '30px',
      textAlign: 'center',
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 15px',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '5px',
      marginBottom: '10px',
      transition: 'background-color 0.3s',
    },
    activeNavItem: {
      backgroundColor: '#3f51b5',
    },
    navIcon: {
      marginRight: '10px',
    },
    content: {
      flex: 1,
      padding: '30px',
      overflowY: 'auto',
    },
    header: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '25px',
      color: '#333',
    },
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '25px',
      marginBottom: '30px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '25px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'transform 0.3s',
    },
    cardIcon: {
      fontSize: '40px',
      marginBottom: '15px',
    },
    cardTitle: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '10px',
    },
    cardValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 10px',
    },
    tableHeader: {
      backgroundColor: '#e8eaf6',
      color: '#333',
      fontWeight: 'bold',
      padding: '15px',
      textAlign: 'left',
      borderRadius: '5px 5px 0 0',
    },
    tableCell: {
      backgroundColor: 'white',
      padding: '15px',
      borderBottom: '1px solid #e0e0e0',
    },
    button: {
      padding: '8px 15px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.3s',
    },
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Admin Dashboard</h2>
        <nav>
          <Link
            to="#"
            style={{...styles.navItem, ...(activeTab === 'dashboard' ? styles.activeNavItem : {})}}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaTachometerAlt style={styles.navIcon} /> Dashboard
          </Link>
          <Link
            to="/admin-mechanics"
            style={{...styles.navItem, ...(activeTab === 'mechanics' ? styles.activeNavItem : {})}}
            onClick={() => setActiveTab('mechanics')}
          >
            <FaWrench style={styles.navIcon} /> Manage Mechanics
          </Link>
          <Link
            to="/admin-users"
            style={{...styles.navItem, ...(activeTab === 'users' ? styles.activeNavItem : {})}}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers style={styles.navIcon} /> Manage Users
          </Link>
          <Link
            to="#"
            style={{...styles.navItem, ...(activeTab === 'payments' ? styles.activeNavItem : {})}}
            onClick={() => setActiveTab('payments')}
          >
            <FaMoneyBillWave style={styles.navIcon} /> Payment History
          </Link>
          <Link to="/" style={{...styles.navItem, marginTop: 'auto', backgroundColor: '#f44336'}}>
            <FaSignOutAlt style={styles.navIcon} /> Logout
          </Link>
        </nav>
      </aside>

      <main style={styles.content}>
        <h2 style={styles.header}>
          {activeTab === 'dashboard' && 'Dashboard Overview'}
          {activeTab === 'mechanics' && 'Registered Mechanics'}
          {activeTab === 'users' && 'Registered Users'}
          {activeTab === 'payments' && 'Payment History'}
        </h2>

        {activeTab === 'dashboard' && (
          <div style={styles.cardContainer}>
            <div style={{...styles.card, backgroundColor: '#3f51b5', color: 'white'}}>
              <FaUsers style={styles.cardIcon} />
              <div style={{...styles.cardTitle, color: '#e8eaf6'}}>Total Users</div>
              <div style={{...styles.cardValue, color: 'white'}}>{stats.totalUsers}</div>
            </div>
            <div style={{...styles.card, backgroundColor: '#4caf50', color: 'white'}}>
              <FaWrench style={styles.cardIcon} />
              <div style={{...styles.cardTitle, color: '#e8f5e9'}}>Total Mechanics</div>
              <div style={{...styles.cardValue, color: 'white'}}>{stats.totalMechanics}</div>
            </div>
            <div style={{...styles.card, backgroundColor: '#f44336', color: 'white'}}>
              <FaClipboardList style={styles.cardIcon} />
              <div style={{...styles.cardTitle, color: '#ffebee'}}>Total Requests</div>
              <div style={{...styles.cardValue, color: 'white'}}>{stats.totalRequests}</div>
            </div>
            <div style={{...styles.card, backgroundColor: '#ff9800', color: 'white'}}>
              <FaMoneyBillWave style={styles.cardIcon} />
              <div style={{...styles.cardTitle, color: '#fff3e0'}}>Total Payments</div>
              <div style={{...styles.cardValue, color: 'white'}}>${stats.totalPayments.toFixed(2)}</div>
            </div>
          </div>
        )}

        {activeTab === 'mechanics' && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Email</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mechanics.map((mechanic) => (
                <tr key={mechanic._id}>
                  <td style={styles.tableCell}>{mechanic.name}</td>
                  <td style={styles.tableCell}>{mechanic.email}</td>
                  <td style={styles.tableCell}>{mechanic.isApproved ? 'Approved' : 'Pending'}</td>
                  <td style={styles.tableCell}>
                    {!mechanic.isApproved && (
                      <button
                        onClick={() => approveMechanic(mechanic._id)}
                        style={{...styles.button, backgroundColor: '#4caf50', color: 'white'}}
                      >
                        <FaCheckCircle style={{ marginRight: '5px' }} /> Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'users' && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Email</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={styles.tableCell}>{user.name}</td>
                  <td style={styles.tableCell}>{user.email}</td>
                  <td style={styles.tableCell}>{user.isBanned ? 'Banned' : 'Active'}</td>
                  <td style={styles.tableCell}>
                    <button
                      onClick={() => toggleBanUser(user._id)}
                      style={{
                        ...styles.button,
                        backgroundColor: user.isBanned ? '#4caf50' : '#f44336',
                        color: 'white',
                      }}
                    >
                      {user.isBanned ? <FaCheckCircle style={{ marginRight: '5px' }} /> : <FaBan style={{ marginRight: '5px' }} />}
                      {user.isBanned ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'payments' && (
          <p>Payment history content goes here.</p>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
// // 




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const colors = {
//   primary: '#2a9df4',
//   secondary: '#DBD5C7',
//   accent: '#2a9df4',
//   dark: '#000000',
//   light: '#DBD5C7',
//   white: '#FFFFFF',
// };

// function ManageUsers() {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [successMessage, setSuccessMessage] = useState('');

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) throw new Error('No token found, please log in.');

//             const response = await axios.get('http://localhost:5000/api/admin/users', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setUsers(response.data);
//         } catch (err) {
//             console.error('Error fetching users:', err);
//             setError(err.response?.data?.msg || err.message || 'Error fetching users');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAction = async (action, id) => {
//         try {
//             setError(null);
//             setSuccessMessage('');
//             const token = localStorage.getItem('token');
//             if (!token) throw new Error('No token found, please log in.');

//             const endpoint = `http://localhost:5000/api/admin/users/${id}/${action}`;
//             console.log(`Attempting to ${action} for user ID: ${id} at endpoint: ${endpoint}`);
    
//             const response = await axios.patch(endpoint, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
    
//             setSuccessMessage(response.data.msg);
//             fetchUsers(); // Refresh user list
//         } catch (err) {
//             console.error(`Error performing ${action}:`, err);
//             setError(err.response?.data?.msg || err.message || `Error performing ${action}`);
//         }
//     };
    
//     if (loading) return (
//         <div style={{ 
//             display: 'flex', 
//             justifyContent: 'center', 
//             alignItems: 'center', 
//             height: '100vh', 
//             fontSize: '1.2rem', 
//             color: colors.primary 
//         }}>
//             Loading...
//         </div>
//     );

//     return (
//         <div style={{ 
//             padding: '2rem', 
//             backgroundColor: colors.white, 
//             minHeight: '100vh',
//             fontFamily: 'Arial, sans-serif'
//         }}>
//             <h2 style={{ 
//                 fontSize: '2rem', 
//                 fontWeight: 'bold', 
//                 marginBottom: '1.5rem', 
//                 color: colors.dark,
//                 borderBottom: `2px solid ${colors.primary}`,
//                 paddingBottom: '0.5rem'
//             }}>
//                 Manage Users
//             </h2>
//             {error && (
//                 <p style={{ 
//                     color: colors.white, 
//                     backgroundColor: '#ff6b6b', 
//                     padding: '1rem', 
//                     borderRadius: '0.25rem', 
//                     marginBottom: '1rem' 
//                 }}>
//                     {error}
//                 </p>
//             )}
//             {successMessage && (
//                 <p style={{
//                     backgroundColor: '#d4edda', 
//                     border: '1px solid #c3e6cb', 
//                     color: '#155724',
//                     padding: '1rem', 
//                     borderRadius: '0.25rem', 
//                     marginBottom: '1rem'
//                 }}>
//                     {successMessage}
//                 </p>
//             )}
            
//             {users.length ? (
//                 <div style={{ 
//                     display: 'grid', 
//                     gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
//                     gap: '1.5rem' 
//                 }}>
//                     {users.map((user) => (
//                         <div key={user._id} style={{ 
//                             border: `1px solid ${colors.secondary}`,
//                             borderRadius: '0.5rem',
//                             padding: '1.5rem',
//                             backgroundColor: colors.light,
//                             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                             transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
//                             ':hover': {
//                                 transform: 'translateY(-5px)',
//                                 boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
//                             }
//                         }}>
//                             <h3 style={{ 
//                                 fontSize: '1.2rem', 
//                                 fontWeight: 'bold', 
//                                 marginBottom: '0.5rem',
//                                 color: colors.dark
//                             }}>
//                                 {user.username}
//                             </h3>
//                             <p style={{ 
//                                 fontSize: '0.9rem', 
//                                 color: colors.dark, 
//                                 marginBottom: '0.5rem' 
//                             }}>
//                                 {user.email}
//                             </p>
//                             <p style={{ 
//                                 fontSize: '0.9rem', 
//                                 color: colors.dark, 
//                                 marginBottom: '0.5rem' 
//                             }}>
//                                 Role: <span style={{ fontWeight: 'bold' }}>{user.role}</span>
//                             </p>
//                             <p style={{ 
//                                 fontSize: '0.9rem', 
//                                 color: user.isActive ? '#28a745' : '#dc3545', 
//                                 fontWeight: 'bold',
//                                 marginBottom: '1rem'
//                             }}>
//                                 Status: {user.isActive ? 'Active' : 'Inactive'}
//                             </p>
//                             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
//                                 <button 
//                                     onClick={() => handleAction(user.isActive ? 'deactivate' : 'activate', user._id)}
//                                     style={{
//                                         padding: '0.5rem 1rem',
//                                         backgroundColor: user.isActive ? '#dc3545' : '#28a745',
//                                         color: colors.white,
//                                         border: 'none',
//                                         borderRadius: '0.25rem',
//                                         cursor: 'pointer',
//                                         transition: 'background-color 0.2s ease-in-out',
//                                         ':hover': {
//                                             backgroundColor: user.isActive ? '#c82333' : '#218838'
//                                         }
//                                     }}
//                                 >
//                                     {user.isActive ? 'Deactivate' : 'Activate'}
//                                 </button>
//                                 <button 
//                                     onClick={() => handleAction(user.role === 'admin' ? 'demote' : 'promote', user._id)}
//                                     style={{
//                                         padding: '0.5rem 1rem',
//                                         backgroundColor: user.role === 'admin' ? colors.secondary : colors.primary,
//                                         color: user.role === 'admin' ? colors.dark : colors.white,
//                                         border: 'none',
//                                         borderRadius: '0.25rem',
//                                         cursor: 'pointer',
//                                         transition: 'background-color 0.2s ease-in-out',
//                                         ':hover': {
//                                             backgroundColor: user.role === 'admin' ? '#c8c8c8' : '#1a8ad9'
//                                         }
//                                     }}
//                                 >
//                                     {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p style={{ 
//                     fontSize: '1.1rem', 
//                     color: colors.dark, 
//                     textAlign: 'center', 
//                     marginTop: '2rem' 
//                 }}>
//                     No users found.
//                 </p>
//             )}
//         </div>
//     );
// }

// export default ManageUsers;



import React, { useEffect, useState } from 'react';
import axios from 'axios';

const colors = {
  primary: '#2a9df4',
  secondary: '#DBD5C7',
  accent: '#2a9df4',
  dark: '#ffffff',
  light: '#153448',
  white: '#FFFFFF',
};

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found, please log in.');

            const response = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.response?.data?.msg || err.message || 'Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action, id) => {
        try {
            setError(null);
            setSuccessMessage('');
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found, please log in.');

            const endpoint = `http://localhost:5000/api/admin/users/${id}/${action}`;
            console.log(`Attempting to ${action} for user ID: ${id} at endpoint: ${endpoint}`);
    
            const response = await axios.patch(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            setSuccessMessage(response.data.msg);
            fetchUsers(); // Refresh user list
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
            color: colors.primary 
        }}>
            Loading...
        </div>
    );

    return (
        <div style={{ 
            padding: '2rem', 
            backgroundColor: colors.white, 
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem', 
                color:"#000000",
                borderBottom: `2px solid ${colors.primary}`,
                paddingBottom: '0.5rem'
            }}>
                Manage Users
            </h2>
            {error && (
                <p style={{ 
                    color: colors.white, 
                    backgroundColor: '#ff6b6b', 
                    padding: '1rem', 
                    borderRadius: '0.25rem', 
                    marginBottom: '1rem' 
                }}>
                    {error}
                </p>
            )}
            {successMessage && (
                <p style={{
                    backgroundColor: '#d4edda', 
                    border: '1px solid #c3e6cb', 
                    color: '#155724',
                    padding: '1rem', 
                    borderRadius: '0.25rem', 
                    marginBottom: '1rem'
                }}>
                    {successMessage}
                </p>
            )}
            
            {users.length ? (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: '1.5rem' 
                }}>
                    {users.map((user) => (
                        <div key={user._id} style={{ 
                            border: `1px solid ${colors.secondary}`,
                            borderRadius: '0.5rem',
                            padding: '1.5rem',
                            backgroundColor: colors.light,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            ':hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                            }
                        }}>
                            <h3 style={{ 
                                fontSize: '1.2rem', 
                                fontWeight: 'bold', 
                                marginBottom: '0.5rem',
                                color: colors.dark
                            }}>
                                {user.username}
                            </h3>
                            <p style={{ 
                                fontSize: '0.9rem', 
                                color: colors.dark, 
                                marginBottom: '0.5rem' 
                            }}>
                                {user.email}
                            </p>
                            <p style={{ 
                                fontSize: '0.9rem', 
                                color: colors.dark, 
                                marginBottom: '0.5rem' 
                            }}>
                                Role: <span style={{ fontWeight: 'bold' }}>{user.role}</span>
                            </p>
                            <p style={{ 
                                fontSize: '0.9rem', 
                                color: user.isActive ? '#28a745' : '#dc3545', 
                                fontWeight: 'bold',
                                marginBottom: '1rem'
                            }}>
                                Status: {user.isActive ? 'Active' : 'Inactive'}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                <button 
                                    onClick={() => handleAction(user.isActive ? 'deactivate' : 'activate', user._id)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: user.isActive ? '#dc3545' : '#28a745',
                                        color: colors.white,
                                        border: 'none',
                                        borderRadius: '0.25rem',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s ease-in-out',
                                        ':hover': {
                                            backgroundColor: user.isActive ? '#c82333' : '#ffffff'
                                        }
                                    }}
                                >
                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button 
                                    onClick={() => handleAction(user.role === 'admin' ? 'demote' : 'promote', user._id)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: user.role === 'admin' ? colors.secondary : colors.primary,
                                        color: user.role === 'admin' ? colors.dark : colors.white,
                                        border: 'none',
                                        borderRadius: '0.25rem',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s ease-in-out',
                                        ':hover': {
                                            backgroundColor: user.role === 'admin' ? '#000000' : '#000000'
                                        }
                                    }}
                                >
                                    {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
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
                    marginTop: '2rem' 
                }}>
                    No users found.
                </p>
            )}
        </div>
    );
}

export default ManageUsers;
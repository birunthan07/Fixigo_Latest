

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import LoginForm from './components/LoginPage';
// import RegisterForm from './components/RegistrationPage';
// import LandingPage from './components/LandingPage';
// import MechanicRegisterForm from './components/MechanicRegister'; // Ensure this is the correct path
// import MechanicLoginForm from './components/MechanicLoginForm';
// import UserDashboard from './components/NormalUserDashboard';
// import AdminDashboard from './components/AdminDashboard';
// import ManageUsers from './components/ ManageUsers.js';
// import ManageMechanics from './components/ManageMechanics';
// import MechanicDashboard from './components/MechanicDashboard';
// import CompletedRepairs from './components/CompletedRepairs';
// import MechanicRequests from './components/MechanicRequests';
// import PaymentPage from './components/PaymentPage1.js';
// import ContactForm from './components/contact';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/contact" element={<ContactForm />} />
//           <Route path="/register" element={<RegisterForm />} />
//           <Route path="/login" element={<LoginForm />} />
//           <Route path="/mechanic-register" element={<MechanicRegisterForm />} />
//           <Route path="/mechanic-login" element={<MechanicLoginForm />} />
//           <Route path="/user-dashboard" element={<UserDashboard />} />
//           <Route path="/admin-dashboard" element={<AdminDashboard />} />
//           <Route path="/admin-users" element={<ManageUsers />} />
//           <Route path="/admin-mechanics" element={<ManageMechanics />} />
//           <Route path="/payment" element={<PaymentPage />} />
//           <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />
//           <Route path="/completed-repairs" element={<CompletedRepairs />} />
//           <Route path="/service-requests" element={<MechanicRequests />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';  // Importing for notifications if you plan to use it
import LoginForm from './components/LoginPage';
import RegisterForm from './components/RegistrationPage';
import LandingPage from './components/LandingPage';
import MechanicRegisterForm from './components/MechanicRegister'; // Ensure this is the correct path
import MechanicLoginForm from './components/MechanicLoginForm';
import UserDashboard from './components/NormalUserDashboard';
import AdminDashboard from './components/AdminDashboard';
import ManageUsers from './components/ ManageUsers.js';
import ManageMechanics from './components/ManageMechanics';
import MechanicDashboard from './components/MechanicDashboard';
import CompletedRepairs from './components/CompletedRepairs';
import MechanicRequests from './components/MechanicRequests';
import PaymentPage from './components/paymentpage.js';  // Ensure correct path
import ContactForm from './components/ContactForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/mechanic-register" element={<MechanicRegisterForm />} />
          <Route path="/mechanic-login" element={<MechanicLoginForm />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-users" element={<ManageUsers />} />
          <Route path="/admin-mechanics" element={<ManageMechanics />} />
          <Route path="/payment/:mechanicId/:token" element={<PaymentPage />} /> {/* Updated payment route */}
          <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />
          <Route path="/completed-repairs" element={<CompletedRepairs />} />
          <Route path="/service-requests" element={<MechanicRequests />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

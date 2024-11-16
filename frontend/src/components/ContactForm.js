// import React, { useState } from 'react';
// import { Loader2, Mail, User, MessageSquare } from 'lucide-react';

// const ContactForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: ''
//   });
//   const [status, setStatus] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const response = await fetch('/api/contact', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to send message');
//       }
      
//       setStatus('success');
//       setFormData({ name: '', email: '', message: '' }); // Reset form
//     } catch (error) {
//       console.error(error);
//       setStatus('error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h2>
//           <p className="text-gray-600">We'd love to hear from you</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <User className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               name="name"
//               placeholder="Your Name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition duration-150"
//             />
//           </div>

//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Mail className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="email"
//               name="email"
//               placeholder="Your Email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition duration-150"
//             />
//           </div>

//           <div className="relative">
//             <div className="absolute top-3 left-3 pointer-events-none">
//               <MessageSquare className="h-5 w-5 text-gray-400" />
//             </div>
//             <textarea
//               name="message"
//               placeholder="Your Message"
//               value={formData.message}
//               onChange={handleChange}
//               required
//               rows="4"
//               className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition duration-150 resize-none"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
//                 Sending...
//               </>
//             ) : (
//               'Send Message'
//             )}
//           </button>
//         </form>

//         {status === 'success' && (
//           <div className="mt-4 p-4 bg-green-50 rounded-lg">
//             <p className="text-green-800 text-center">
//               Message sent successfully!
//             </p>
//           </div>
//         )}

//         {status === 'error' && (
//           <div className="mt-4 p-4 bg-red-50 rounded-lg">
//             <p className="text-red-800 text-center">
//               Failed to send message. Please try again.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ContactForm;




import React, { useState } from 'react';
import { Loader2, Mail, User, MessageSquare } from 'lucide-react';

const colors = {
  primary: '#2a9df4',
  secondary: '#DBD5C7',
  accent: '#2a9df4',
  dark: '#000000',
  light: '#DBD5C7',
  white: '#FFFFFF',
};

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    paddingLeft: '40px',
    paddingRight: '12px',
    paddingTop: '12px',
    paddingBottom: '12px',
    border: `1px solid ${colors.secondary}`,
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
  };

  const iconStyle = {
    position: 'absolute',
    top: '50%',
    left: '12px',
    transform: 'translateY(-50%)',
    color: colors.primary,
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.light,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '32px',
      }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: colors.dark,
            marginBottom: '8px',
          }}>Contact Us</h2>
          <p style={{ color: colors.dark, opacity: 0.7 }}>We'd love to hear from you</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ position: 'relative' }}>
            <User style={iconStyle} size={20} />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Mail style={iconStyle} size={20} />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <MessageSquare style={{ ...iconStyle, top: '24px' }} size={20} />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              style={{
                ...inputStyle,
                paddingTop: '24px',
                resize: 'vertical',
                minHeight: '120px',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              backgroundColor: colors.primary,
              color: colors.white,
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} size={20} />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>

        {status === 'success' && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
          }}>
            <p style={{ color: '#155724', textAlign: 'center' }}>
              Message sent successfully!
            </p>
          </div>
        )}

        {status === 'error' && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#f8d7da',
            borderRadius: '8px',
          }}>
            <p style={{ color: '#721c24', textAlign: 'center' }}>
              Failed to send message. Please try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
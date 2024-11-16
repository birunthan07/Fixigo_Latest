

// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { FaMapMarkerAlt, FaSearch, FaStar, FaPhone, FaEnvelope, FaCar, FaUserCog, FaWrench, FaPlay, FaPause } from 'react-icons/fa';

// const colors = {
//   primary: '#2a9df4',
//   secondary: '#DBD5C7',
//   accent: '#2a9df4',
//   dark: '#000000',
//   light: '#DBD5C7',
//   white: '#FFFFFF',
// };

// const pulseAnimation = `
//   @keyframes pulse {
//     0% { transform: scale(1); }
//     50% { transform: scale(1.05); }
//     100% { transform: scale(1); }
//   }
// `;

// const glowAnimation = `
//   @keyframes glow {
//     0% { box-shadow: 0 0 5px ${colors.primary}; }
//     50% { box-shadow: 0 0 20px ${colors.primary}, 0 0 30px ${colors.primary}; }
//     100% { box-shadow: 0 0 5px ${colors.primary}; }
//   }
// `;

// const fadeInAnimation = `
//   @keyframes fadeIn {
//     from { opacity: 0; transform: translateY(20px); }
//     to { opacity: 1; transform: translateY(0); }
//   }
// `;

// const popAnimation = `
//   @keyframes pop {
//     0% { transform: scale(1); }
//     50% { transform: scale(1.1); }
//     100% { transform: scale(1); }
//   }
// `;

// const borderRadiationAnimation = `
//   @keyframes borderRadiation {
//     0% { box-shadow: 0 0 0 0 rgba(42, 157, 244, 0.7); }
//     70% { box-shadow: 0 0 0 10px rgba(42, 157, 244, 0); }
//     100% { box-shadow: 0 0 0 0 rgba(42, 157, 244, 0); }
//   }
// `;

// const floatAnimation = `
//   @keyframes float {
//     0% { transform: translateY(0px); }
//     50% { transform: translateY(-10px); }
//     100% { transform: translateY(0px); }
//   }
// `;

// export default function LandingPage() {
//   const [isVisible, setIsVisible] = useState({});
//   const [isPlaying, setIsPlaying] = useState(false);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
//             // Play video when it becomes visible
//             if (videoRef.current && !isPlaying) {
//               videoRef.current.play().catch((error) => {
//                 console.error("Error trying to play the video:", error);
//               });
//               setIsPlaying(true);
//             }
//           } else {
//             // Pause video when it goes out of view
//             if (videoRef.current && isPlaying) {
//               videoRef.current.pause();
//               setIsPlaying(false);
//             }
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     document.querySelectorAll('section').forEach((section) => {
//       observer.observe(section);
//     });

//     return () => observer.disconnect();
//   }, [isPlaying]);

//   const toggleVideo = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play().catch((error) => {
//           console.error("Error trying to play the video:", error);
//         });
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       display: 'flex',
//       flexDirection: 'column',
//       fontFamily: 'Arial, sans-serif',
//       color: colors.white,
//       backgroundColor: colors.dark,
//     }}>
//       <style>
//         {pulseAnimation}
//         {glowAnimation}
//         {fadeInAnimation}
//         {popAnimation}
//         {borderRadiationAnimation}
//         {floatAnimation}
//       </style>
//       {/* Header */}
//       <header style={{
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         color: colors.white,
//         padding: '1rem 0',
//         position: 'sticky',
//         top: 0,
//         zIndex: 1000,
//         boxShadow: '0 2px 4px rgba(42, 157, 244, 0.2)',
//         animation: 'fadeIn 0.5s ease-out, borderRadiation 2s infinite'
//       }}>
//         <div style={{
//           maxWidth: '1200px',
//           margin: '0 auto',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Link to="/" style={{
//             display: 'flex',
//             alignItems: 'center',
//             textDecoration: 'none',
//             color: colors.white
//           }}>
//             <img src="./fixigo(1).png" alt="FIXIGO" style={{ height: '30px', marginRight: '0.5rem', animation: 'pulse 2s infinite' }} />
//             <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>FIXIGO</span>
//           </Link>
         
// <nav>
//   <ul style={{
//     display: 'flex',
//     listStyle: 'none',
//     margin: 0,
//     padding: 0
//   }}>
//     {['About', 'Services'].map((item, index) => (
//       <li key={index} style={{ marginLeft: '1.5rem' }}>
//         <a href={`#${item.toLowerCase().replace(' ', '-')}`} style={{
//           color: colors.white,
//           textDecoration: 'none',
//           fontSize: '0.9rem',
//           transition: 'all 0.3s',
//           position: 'relative',
//           ':hover': {
//             color: colors.secondary
//           },
//           ':after': {
//             content: '""',
//             position: 'absolute',
//             width: '0',
//             height: '2px',
//             bottom: '-5px',
//             left: '50%',
//             backgroundColor: colors.primary,
//             transition: 'all 0.3s'
//           },
//           ':hover:after': {
//             width: '100%',
//             left: '0'
//           }
//         }}>
//           {item}
//         </a>
//       </li>
//     ))}
//     <li style={{ marginLeft: '1.5rem' }}>
//       <Link to="/contact" style={{
//         color: colors.white,
//         textDecoration: 'none',
//         fontSize: '0.9rem',
//         transition: 'all 0.3s',
//         ':hover': {
//           color: colors.secondary
//         }
//       }}>
//         Contact
//       </Link>
//     </li>
//     <li style={{ marginLeft: '1.5rem' }}>
//       <Link to="/login" style={{
//         color: colors.white,
//         textDecoration: 'none',
//         fontSize: '0.9rem',
//         transition: 'all 0.3s',
//         ':hover': {
//           color: colors.secondary
//         }
//       }}>
//         Login
//       </Link>
//     </li>
//     <li style={{ marginLeft: '1.5rem' }}>
//       <Link to="/register" style={{
//         backgroundColor: colors.primary,
//         color: colors.white,
//         padding: '0.5rem 1rem',
//         borderRadius: '4px',
//         textDecoration: 'none',
//         fontSize: '0.9rem',
//         transition: 'all 0.3s',
//         animation: 'glow 2s infinite, borderRadiation 2s infinite',
//         ':hover': {
//           backgroundColor: colors.secondary,
//           color: colors.dark,
//           transform: 'translateY(-3px)',
//           boxShadow: '0 4px 8px rgba(42, 157, 244, 0.3)'
//         }
//       }}>
//         Register
//       </Link>
//     </li>
//     <li style={{ marginLeft: '1rem' }}>
//       <Link to="/mechanic-register" style={{
//         backgroundColor: colors.secondary,
//         color: colors.dark,
//         padding: '0.5rem 1rem',
//         borderRadius: '4px',
//         textDecoration: 'none',
//         fontSize: '0.9rem',
//         transition: 'all 0.3s',
//         animation: 'borderRadiation 2s infinite',
//         ':hover': {
//           backgroundColor: colors.primary,
//           color: colors.white,
//           transform: 'translateY(-3px)',
//           boxShadow: '0 4px 8px rgba(219, 213, 199, 0.3)'
//         }
//       }}>
//         Mechanic
//       </Link>
//     </li>
//   </ul>
// </nav>
//         </div>
//       </header>

//       {/* Hero Section with Video */}
//       <section id="hero" style={{
//       position: 'relative',
//       minHeight: '100vh',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       color: colors.white,
//       overflow: 'hidden'
//     }}>
//       <video
//         ref={videoRef}
//         style={{
//           position: 'absolute',
//           width: '100%',
//           height: '100%',
//           objectFit: 'cover',
//           zIndex: -1,
//         }}
//         loop
//         muted
//         playsInline
//         autoPlay
//       >
//         <source
//           src="https://static-assets.mapbox.com/www/videos/home/section_carousel-looping-background/video@720p.mp4"
//           type="video/mp4"
//         />
//         <img
//           src="https://static-assets.mapbox.com/www/videos/home/section_carousel-looping-background/poster.jpeg"
//           alt="Video poster"
//         />
//         Your browser does not support the video tag.
//       </video>
//       <div style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         zIndex: -1
//       }} />
//       <div style={{
//         maxWidth: '800px',
//         textAlign: 'center',
//         zIndex: 1,
//         animation: 'fadeIn 1s ease-out'
//       }}>
//         <h1 style={{
//           fontSize: '3.5rem',
//           fontWeight: 'bold',
//           marginBottom: '1rem',
//           textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
//         }}>
//           Your Next Mechanic is Just a Tap Away
//         </h1>
//         <p style={{
//           fontSize: '1.2rem',
//           marginBottom: '2rem',
//           textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
//         }}>
//           Find a reliable mechanic quickly and easily. Join us and make your vehicle maintenance hassle-free.
//         </p>
//         <Link to="/user-dashboard" style={{
//           backgroundColor: colors.secondary,
//           color: colors.dark,
//           padding: '0.75rem 1.5rem',
//           borderRadius: '4px',
//           textDecoration: 'none',
//           fontSize: '1.1rem',
//           fontWeight: 'bold',
//           transition: 'all 0.3s',
//           boxShadow: '0 4px 6px rgba(219, 213, 199, 0.2)',
//           animation: 'pulse 2s infinite',
//         }}>
//           Find a Mechanic
//         </Link>
//       </div>
//       <button
//         onClick={toggleVideo}
//         style={{
//           position: 'absolute',
//           bottom: '20px',
//           right: '20px',
//           backgroundColor: 'rgba(255, 255, 255, 0.2)',
//           border: 'none',
//           borderRadius: '50%',
//           width: '50px',
//           height: '50px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           cursor: 'pointer',
//           transition: 'all 0.3s',
//         }}
//       >
//         {isPlaying ? <FaPause color={colors.white} /> : <FaPlay color={colors.white} />}
//       </button>
//     </section>

//       {/* About Section */}
//       <section id="about" style={{
//         padding: '6rem 0',
//         backgroundColor: colors.dark,
//         opacity: isVisible.about ? 1 : 0,
//         transform: isVisible.about ? 'translateY(0)' : 'translateY(20px)',
//         transition: 'opacity 0.5s, transform 0.5s'
//       }}>
//         <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
//           <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: colors.white, animation: 'glow 2s infinite' }}>About FIXIGO</h2>
//           <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: colors.secondary }}>
//             FIXIGO is your go-to platform for connecting with skilled mechanics in your area. We simplify the process of finding and booking automotive services, ensuring your vehicle gets the care it deserves.
//           </p>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section id="services" style={{
//         padding: '6rem 0',
//         backgroundColor: colors.light,
//         opacity: isVisible.services ? 1 : 0,
//         transform: isVisible.services ? 'translateY(0)' : 'translateY(20px)',
//         transition: 'opacity 0.5s, transform 0.5s'
//       }}>
//         <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//           <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', color: colors.dark, animation: 'glow 2s infinite' }}>Our Services</h2>
//           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
//             {[
//               { icon: FaSearch, title: "Find Mechanics", description: "Easily search for qualified mechanics in your area based on your specific needs and location." },
//               { icon: FaWrench, title: "Book Services", description: "Schedule appointments for various automotive services with just a few clicks, saving you time and hassle." },
//               { icon: FaCar, title: "Emergency Assistance", description: "Get quick help for unexpected breakdowns with our network of reliable emergency service providers." },
//               { icon: FaUserCog, title: "Mechanic Profiles", description: "View  detailed profiles and ratings of mechanics to make informed decisions about your car's maintenance." }
//             ].map((service, index) => (
//               <div key={index} style={{
//                 flex: '1 1 250px',
//                 maxWidth: '300px',
//                 backgroundColor: colors.white,
//                 borderRadius: '8px',
//                 padding: '2rem',
//                 textAlign: 'center',
//                 boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//                 transition: 'all 0.3s',
//                 animation: `fadeIn 0.5s ease-out ${index * 0.1}s, borderRadiation 2s infinite ${index * 0.2}s, float 6s ease-in-out infinite ${index * 0.5}s`,
//                 ':hover': {
//                   transform: 'translateY(-10px) scale(1.05)',
//                   boxShadow: '0 12px 20px rgba(42, 157, 244, 0.2)'
//                 }
//               }}>
//                 <service.icon style={{ fontSize: '3rem', color: colors.primary, marginBottom: '1rem', animation: 'pulse 2s infinite' }} />
//                 <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: colors.dark }}>{service.title}</h3>
//                 <p style={{ color: colors.dark }}>{service.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section id="how-it-works" style={{
//         padding: '6rem 0',
//         backgroundColor: colors.dark,
//         opacity: isVisible['how-it-works'] ? 1 : 0,
//         transform: isVisible['how-it-works'] ? 'translateY(0)' : 'translateY(20px)',
//         transition: 'opacity 0.5s, transform 0.5s'
//       }}>
//         <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//           <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', color: colors.white, animation: 'glow 2s infinite' }}>How It Works</h2>
//           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
//             {[
//               { number: 1, title: "Search", description: "Enter your location and the service you need to find nearby mechanics." },
//               { number: 2, title: "Compare", description: "View profiles, ratings, and prices of nearby mechanics to make the best choice." },
//               { number: 3, title: "Book", description: "Select a mechanic and schedule your appointment at a time that suits you." },
//               { number: 4, title: "Service", description: "Get your vehicle serviced by a professional mechanic and enjoy peace of mind." }
//             ].map((step, index) => (
//               <div key={index} style={{ flex: '1 1 250px', maxWidth: '250px', textAlign: 'center' }}>
//                 <div style={{
//                   width: '80px',
//                   height: '80px',
//                   borderRadius: '50%',
//                   backgroundColor: colors.primary,
//                   color: colors.white,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontSize: '2rem',
//                   fontWeight: 'bold',
//                   margin: '0 auto 1rem',
//                   boxShadow: '0 4px 6px rgba(42, 157, 244, 0.3)',
//                   animation: `pulse 2s infinite ${index * 0.2}s, glow 3s infinite alternate ${index * 0.2}s, pop 0.5s ${index * 0.1}s`
//                 }}>
//                   {step.number}
//                 </div>
//                 <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: colors.white }}>{step.title}</h3>
//                 <p style={{ color: colors.secondary }}>{step.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section id="testimonials" style={{
//         padding: '6rem 0',
//         backgroundColor: colors.light,
//         opacity: isVisible.testimonials ? 1 : 0,
//         transform: isVisible.testimonials ? 'translateY(0)' : 'translateY(20px)',
//         transition: 'opacity 0.5s, transform 0.5s'
//       }}>
//         <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//           <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', color: colors.dark, animation: 'glow 2s infinite' }}>What Our Customers Say</h2>
//           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
//             {[
//               { quote: "FIXIGO saved me so much time and hassle. I found a great mechanic in minutes!", author: "John D.", rating: 5 },
//               { quote: "The mechanics on this platform are truly professional. I'm a satisfied repeat customer!", author: "Sarah M.", rating: 5 }
//             ].map((testimonial, index) => (
//               <div key={index} style={{
//                 flex: '1 1 300px',
//                 maxWidth: '400px',
//                 backgroundColor: colors.white,
//                 borderRadius: '8px',
//                 padding: '2rem',
//                 boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//                 transition: 'all 0.3s',
//                 animation: `fadeIn 0.5s ease-out ${index * 0.2}s, borderRadiation 2s infinite ${index * 0.2}s, float 6s ease-in-out infinite ${index * 0.5}s`,
//                 ':hover': {
//                   transform: 'translateY(-10px) scale(1.03)',
//                   boxShadow: '0 12px 20px rgba(42, 157, 244, 0.2)'
//                 }
//               }}>
//                 <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1rem', color: colors.dark }}>"{testimonial.quote}"</p>
//                 <p style={{ fontWeight: 'bold', color: colors.dark }}>{testimonial.author}</p>
//                 <div style={{ color: colors.primary, marginTop: '0.5rem' }}>
//                   {[...Array(testimonial.rating)].map((_, i) => (
//                     <FaStar key={i} style={{ marginRight: '0.25rem', animation: `pulse 1s infinite ${i * 0.1}s` }} />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Call to Action Section */}
//       <section id="cta" style={{
//         padding: '6rem 0',
//         backgroundColor: colors.primary,
//         color: colors.white,
//         textAlign: 'center',
//         opacity: isVisible.cta ? 1 : 0,
//         transform: isVisible.cta ? 'translateY(0)' : 'translateY(20px)',
//         transition: 'opacity 0.5s, transform 0.5s'
//       }}>
//         <div style={{ maxWidth: '800px', margin: '0 auto' }}>
//           <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'glow 2s infinite' }}>Ready to Find Your Mechanic?</h2>
//           <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
//             Join thousands of satisfied customers who have found reliable mechanics through our platform.
//           </p>
//           <Link to="/register" style={{
//             backgroundColor: colors.secondary,
//             color: colors.dark,
//             padding: '0.75rem 1.5rem',
//             borderRadius: '4px',
//             textDecoration: 'none',
//             fontSize: '1.1rem',
//             fontWeight: 'bold',
//             transition: 'all 0.3s',
//             boxShadow: '0 4px 6px rgba(219, 213, 199, 0.2)',
//             animation: 'pulse 2s infinite, borderRadiation 2s infinite',
//             ':hover': {
//               backgroundColor: colors.white,
//               color: colors.primary,
//               transform: 'translateY(-5px) scale(1.05)',
//               boxShadow: '0 8px 15px rgba(255, 255, 255, 0.3)'
//             }
//           }}>
//             Get Started
//           </Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer style={{
//         backgroundColor: colors.dark,
//         color: colors.light,
//         padding: '3rem 0',
//         animation: 'fadeIn 0.5s ease-out'
//       }}>
//         <div style={{
//           maxWidth: '1200px',
//           margin: '0 auto',
//           display: 'flex',
//           flexWrap: 'wrap',
//           justifyContent: 'space-between'
//         }}>
//           <div style={{ flex: '1 1 300px', marginBottom: '2rem' }}>
//             <h5 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: colors.white, animation: 'glow 2s infinite' }}>FIXIGO</h5>
//             <p style={{ fontSize: '0.9rem', color: colors.secondary }}>Connecting you with the best mechanics in your area.</p>
//           </div>
//           <div style={{ flex: '1 1 300px', marginBottom: '2rem' }}>
//             <h5 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: colors.white }}>Quick Links</h5>
//             <ul style={{ listStyle: 'none', padding: 0 }}>
//               {['About', 'Services', 'How It Works', 'Contact'].map((item, index) => (
//                 <li key={index} style={{ marginBottom: '0.5rem' }}>
//                   <a href={`#${item.toLowerCase().replace(' ', '-')}`} style={{
//                     color: colors.secondary,
//                     textDecoration: 'none',
//                     fontSize: '0.9rem',
//                     transition: 'all 0.3s',
//                     ':hover': {
//                       color: colors.primary,
//                       transform: 'translateX(5px)'
//                     }
//                   }}>
//                     {item}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div style={{ flex: '1 1 300px', marginBottom: '2rem' }}>
//             <h5 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: colors.white }}>Contact Us</h5>
//             <ul style={{ listStyle: 'none', padding: 0 }}>
//               <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', color: colors.secondary }}>
//                 <FaEnvelope style={{ marginRight: '0.5rem', color: colors.primary, animation: 'pulse 2s infinite' }} /> info@fixigo.com
//               </li>
//               <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', color: colors.secondary }}>
//                 <FaPhone style={{ marginRight: '0.5rem', color: colors.primary, animation: 'pulse 2s infinite' }} /> (123) 456-7890
//               </li>
//               <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', color: colors.secondary }}>
//                 <FaMapMarkerAlt style={{ marginRight: '0.5rem', color: colors.primary, animation: 'pulse 2s infinite' }} /> 123 Mechanic Street, Auto City, AC 12345
//               </li>
//             </ul>
//           </div>
//         </div>
//         <div style={{
//           borderTop: `1px solid ${colors.secondary}`,
//           marginTop: '2rem',
//           paddingTop: '2rem',
//           textAlign: 'center'
//         }}>
//           <p style={{ fontSize: '0.9rem', color: colors.secondary }}>&copy; 2024 FIXIGO. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch, FaStar, FaPhone , FaCar, FaUserCog, FaWrench, FaPlay, FaPause, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

const colors = {
 primary: '#2a9df4',
 secondary: '#DBD5C7',
 accent: '#2a9df4',
 dark: '#000000',
 light: '#DBD5C7',
 white: '#FFFFFF',
};

const pulseAnimation = `
 @keyframes pulse {
 0% { transform: scale(1); }
 50% { transform: scale(1.05); }
 100% { transform: scale(1); }
 }
`;

const glowAnimation = `
 @keyframes glow {
 0% { box-shadow: 0 0 5px ${colors.primary}; }
 50% { box-shadow: 0 0 20px ${colors.primary}, 0 0 30px ${colors.primary}; }
 100% { box-shadow: 0 0 5px ${colors.primary}; }
 }
`;

const fadeInAnimation = `
 @keyframes fadeIn {
 from { opacity: 0; transform: translateY(20px); }
 to { opacity: 1; transform: translateY(0); }
 }
`;

const popAnimation = `
 @keyframes pop {
 0% { transform: scale(1); }
 50% { transform: scale(1.1); }
 100% { transform: scale(1); }
 }
`;

const borderRadiationAnimation = `
 @keyframes borderRadiation {
 0% { box-shadow: 0 0 0 0 rgba(42, 157, 244, 0.7); }
 70% { box-shadow: 0 0 0 10px rgba(42, 157, 244, 0); }
 100% { box-shadow: 0 0 0 0 rgba(42, 157, 244, 0); }
 }
`;

const floatAnimation = `
 @keyframes float {
 0% { transform: translateY(0px); }
 50% { transform: translateY(-10px); }
 100% { transform: translateY(0px); }
 }
`;

export default function LandingPage() {
 const [isVisible, setIsVisible] = useState({});
 const [isPlaying, setIsPlaying] = useState(false);
 const videoRef = useRef(null);

 useEffect(() => {
 const observer = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting) {
 setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
 // Play video when it becomes visible
 if (videoRef.current && !isPlaying) {
 videoRef.current.play().catch((error) => {
 console.error("Error trying to play the video:", error);
 });
 setIsPlaying(true);
 }
 } else {
 // Pause video when it goes out of view
 if (videoRef.current && isPlaying) {
 videoRef.current.pause();
 setIsPlaying(false);
 }
 }
 });
 },
 { threshold: 0.1 }
 );

 document.querySelectorAll('section').forEach((section) => {
 observer.observe(section);
 });

 return () => observer.disconnect();
 }, [isPlaying]);

 const toggleVideo = () => {
 if (videoRef.current) {
 if (isPlaying) {
 videoRef.current.pause();
 } else {
 videoRef.current.play().catch((error) => {
 console.error("Error trying to play the video:", error);
 });
 }
 setIsPlaying(!isPlaying);
 }
 };

 return (
 <div style={{
 minHeight: '100vh',
 display: 'flex',
 flexDirection: 'column',
 fontFamily: 'Arial, sans-serif',
 color: colors.white,
 backgroundColor: colors.dark,
 }}>
 <style>
 {pulseAnimation}
 {glowAnimation}
 {fadeInAnimation}
 {popAnimation}
 {borderRadiationAnimation}
 {floatAnimation}
 </style>
 {/* Header */}
 <header style={{
 backgroundColor: 'rgba(0, 0, 0, 0.8)',
 color: colors.white,
 padding: '1rem 0',
 position: 'sticky',
 top: 0,
 zIndex: 1000,
 boxShadow: '0 2px 4px rgba(42, 157, 244, 0.2)',
 animation: 'fadeIn 0.5s ease-out, borderRadiation 2s infinite'
 }}>
 <div style={{
 maxWidth: '1200px',
 margin: '0 auto',
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center'
 }}>
 <Link to="/" style={{
 display: 'flex',
 alignItems: 'center',
 textDecoration: 'none',
 color: colors.white
 }}>
 <img src="./fixigoLogo.png" alt="FIXIGO" style={{ height: '30px', marginRight: '0.5rem', animation: 'pulse 2s infinite' }} />
 <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>FIXIGO</span>
 </Link>
 <nav>
 <ul style={{
 display: 'flex',
 listStyle: 'none',
 margin: 0,
 padding: 0
 }}>
 {['About', 'Services', 'Contact'].map((item, index) => (
 <li key={index} style={{ marginLeft: '1.5rem' }}>
 <a href={`#${item.toLowerCase().replace(' ', '-')}`} style={{
 color: colors.white,
 textDecoration: 'none',
 fontSize: '0.9rem',
 transition: 'all 0.3s',
 position: 'relative',
 ':hover': {
 color: colors.secondary
 },
 ':after': {
 content: '""',
 position: 'absolute',
 width: '0',
 height: '2px',
 bottom: '-5px',
 left: '50%',
 backgroundColor: colors.primary,
 transition: 'all 0.3s'
 },
 ':hover:after': {
 width: '100%',
 left: '0'
 }
 }}>
 {item}
 </a>
 </li>
 ))}
 <li style={{ marginLeft: '1.5rem' }}>
 <Link to="/login" style={{
 color: colors.white,
 textDecoration: 'none',
 fontSize: '0.9rem',
 transition: 'all 0.3s',
 ':hover': {
 color: colors.secondary
 }
 }}>
 Login
 </Link>
 </li>
 <li style={{ marginLeft: '1.5rem' }}>
 <Link to="/register" style={{
 backgroundColor: colors.primary,
 color: colors.white,
 padding: '0.5rem 1rem',
 borderRadius: '4px',
 textDecoration: 'none',
 fontSize: '0.9rem',
 transition: 'all 0.3s',
 animation: 'glow 2s infinite, borderRadiation 2s infinite',
 ':hover': {
 backgroundColor: colors.secondary,
 color: colors.dark,
 transform: 'translateY(-3px)',
 boxShadow: '0 4px 8px rgba(42, 157, 244, 0.3)'
 }
 }}>
 Register
 </Link>
 </li>
 <li style={{ marginLeft: '1rem' }}>
 <Link to="/mechanic-register" style={{
 backgroundColor: colors.secondary,
 color: colors.dark,
 padding: '0.5rem 1rem',
 borderRadius: '4px',
 textDecoration: 'none',
 fontSize: '0.9rem',
 transition: 'all 0.3s',
 animation: 'borderRadiation 2s infinite',
 ':hover': {
 backgroundColor: colors.primary,
 color: colors.white,
 transform: 'translateY(-3px)',
 boxShadow: '0 4px 8px rgba(219, 213, 199, 0.3)'
 }
 }}>
 Mechanic
 </Link>
 </li>
 </ul>
 </nav>
 </div>
 </header>

 {/* Hero Section with Video */}
<section
 id="hero"
 style={{
 position: 'relative',
 minHeight: '100vh',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between', // Adjusts layout for image and text side-by-side
 color: colors.white,
 overflow: 'hidden',
 padding: '0 2rem', // Adds padding for layout
 }}
>
 {/* Background Video */}
 <video
 ref={videoRef}
 style={{
 position: 'absolute',
 width: '100%',
 height: '100%',
 objectFit: 'cover',
 zIndex: -2,
 }}
 loop
 muted
 playsInline
 autoPlay
 >
 <source
 src="https://static-assets.mapbox.com/www/videos/home/section_carousel-looping-background/video@720p.mp4"
 type="video/mp4"
 />
 <img src="/headerImage.webp" alt="Video poster" />
 Your browser does not support the video tag.
 </video>

 {/* Overlay for Dark Effect */}
 <div
 style={{
 position: 'absolute',
 top: 0,
 left: 0,
 width: '100%',
 height: '100%',
 backgroundColor: 'rgba(0, 0, 0, 0.5)',
 zIndex: -1,
 }}
 />

 {/* Left-Side Image */}
 <div style={{ flex: '1', maxWidth: '400px', zIndex: 1 }}>
 <img
 src="/headerImage.webp" // Replace with actual image source
 alt="Hero Section Image"
 style={{
 width: '100%',
 borderRadius: '8px',
 paddingLeft:'100px',
 boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
 }}
 />
 </div>

 {/* Right-Side Text Content */}
 <div
 style={{
 flex: '1',
 maxWidth: '800px',
 textAlign: 'center',
 zIndex: 1,
 animation: 'fadeIn 1s ease-out',
 padding: '2rem',
 }}
 >
 <h1
 style={{
 fontSize: '3.5rem',
 fontWeight: 'bold',
 marginBottom: '1rem',
 textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
 }}
 >
 Your Next Mechanic is Just a Tap Away
 </h1>
 <p
 style={{
 fontSize: '1.5rem',
 marginBottom: '2rem',
 textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
 }}
 >
 Find a reliable mechanic quickly and easily. Join us and make your vehicle maintenance hassle-free.
 </p>
 <Link
 to="/user-dashboard"
 style={{
 backgroundColor: colors.primary,
 color: colors.dark,
 padding: '0.75rem 1.5rem',
 borderRadius: '4px',
 textDecoration: 'none',
 fontSize: '1.1rem',
 fontWeight: 'bold',
 transition: 'all 0.3s',
 boxShadow: '0 4px 6px rgba(219, 213, 199, 0.2)',
 animation: 'pulse 2s infinite',
 ':hover': {
 backgroundColor: colors.secondary,
 color: colors.dark,
 transform: 'translateY(-3px)',
 boxShadow: '0 4px 8px rgba(42, 157, 244, 0.3)'
 }
 }}
 >
 Find a Mechanic
 </Link>
 </div>

 {/* Video Toggle Button */}
 <button
 onClick={toggleVideo}
 style={{
 position: 'absolute',
 bottom: '20px',
 right: '20px',
 backgroundColor: 'rgba(255, 255, 255, 0.2)',
 border: 'none',
 borderRadius: '50%',
 width: '50px',
 height: '50px',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 cursor: 'pointer',
 transition: 'all 0.3s',
 }}
 >
 {isPlaying ? <FaPause color={colors.white} /> : <FaPlay color={colors.white} />}
 </button>
</section>


<section style={{
 position: 'relative',
 width: '100%',
 height: '80vh', // Adjust the section height to control the overall height
 overflow: 'hidden',
 marginTop: '0'
}}>
 <video
 ref={videoRef}
 autoPlay
 loop
 muted
 playsInline
 style={{
 position: 'absolute',
 top: 0,
 left: 0,
 width: '100%',
 height: '100%', // Adjusted to ensure the video fills the entire section height
 objectFit: 'cover',
 zIndex: 0,
 }}
 >
 <source src="/video2.mp4" type="video/mp4" />
 Your browser does not support the video tag.
 </video>
 <div style={{
 position: 'absolute',
 top: 0,
 left: 0,
 width: '100%',
 height: '100%',
 backgroundColor: 'rgba(0, 0, 0, 0.5)',
 zIndex: 1,
 }} />
 <div style={{
 position: 'relative',
 zIndex: 2,
 padding: '4rem',
 display: 'flex',
 flexDirection: 'column',
 justifyContent: 'center',
 alignItems: 'center',
 height: '80%', // Ensures content aligns within the new height
 textAlign: 'center'
 }}>
 
 <Link to="/services" style={{
 backgroundColor: colors.primary,
 color: colors.white,
 padding: '1rem 3rem',
 borderRadius: '4px',
 textDecoration: 'none',
 fontSize: '1.1rem',
 fontWeight: 'bold',
 transition: 'all 0.3s',
 animation: 'pulse 2s infinite'
 }}>
 Explore Our Services
 </Link>
 </div>
</section>


 {/* About Section */}
 <section
 id="about"
 style={{
 padding: '10rem 0', // Increase padding to make the section taller
 minHeight: '50vh', // Set a minimum height for the section
 backgroundColor: colors.dark,
 opacity: isVisible.about ? 1 : 0,
 transform: isVisible.about ? 'translateY(0)' : 'translateY(20px)',
 transition: 'opacity 0.5s, transform 0.5s',
 justifyContent:'center'
 }}
>
 <div
 style={{
 maxWidth: '1200px',
 margin: '0 auto',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 textAlign: 'center',
 flexWrap: 'wrap',
 gap: '2rem',
 }}
 >
 {/* Text Content */}
 <div style={{ flex: '1', textAlign: 'left', minWidth: '300px' }}>
 <h2
 style={{
 fontSize: '3.5rem',
 marginBottom: '2.5rem',
 color: colors.white,
 animation: 'glow 2s infinite',
 }}
 >
 About FIXIGO
 </h2>
 <p style={{ fontSize: '1.5rem', lineHeight: 1.6, color: colors.secondary }}>
 FIXIGO is your go-to platform for connecting with skilled mechanics in your area.
 We simplify the process of finding and booking automotive services, ensuring
 your vehicle gets the care it deserves.
 </p>
 </div>

 {/* Right Side Image */}
 <div style={{ flex: '1', textAlign: 'center', minWidth: '300px' }}>
 <img
 src="/mapImage.webp" // Replace with actual image source
 alt="About FIXIGO"
 style={{
 width: '100%',
 maxWidth: '600px',
 borderRadius: '8px',
 boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
 }}
 />
 </div>
 </div>
</section>


 {/* Services Section */}
 <section id="services" style={{
 padding: '6rem 0',
 backgroundColor: colors.light,
 opacity: isVisible.services ? 1 : 0,
 transform: isVisible.services ? 'translateY(0)' : 'translateY(20px)',
 transition: 'opacity 0.5s, transform 0.5s'
 }}>
 <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
 <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', color: colors.dark, animation: 'glow 2s infinite' }}>Our Services</h2>
 <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
 {[
 { icon: FaSearch, title: "Find Mechanics", description: "Easily search for qualified mechanics in your area based on your specific needs and location." },
 { icon: FaWrench, title: "Book Services", description: "Schedule appointments for various automotive services with just a few clicks, saving you time and hassle." },
 { icon: FaCar, title: "Emergency Assistance", description: "Get quick help for unexpected breakdowns with our network of reliable emergency service providers." },
 { icon: FaUserCog, title: "Mechanic Profiles", description: "View detailed profiles and ratings of mechanics to make informed decisions about your car's maintenance." }
 ].map((service, index) => (
 <div key={index} style={{
 flex: '1 1 250px',
 maxWidth: '300px',
 backgroundColor: colors.white,
 borderRadius: '8px',
 padding: '2rem',
 textAlign: 'center',
 boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
 transition: 'all 0.3s',
 animation: `fadeIn 0.5s ease-out ${index * 0.1}s, borderRadiation 2s infinite ${index * 0.2}s, float 6s ease-in-out infinite ${index * 0.5}s`,
 ':hover': {
 transform: 'translateY(-10px) scale(1.05)',
 boxShadow: '0 12px 20px rgba(42, 157, 244, 0.2)'
 }
 }}>
 <service.icon style={{ fontSize: '3rem', color: colors.primary, marginBottom: '1rem', animation: 'pulse 2s infinite' }} />
 <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: colors.dark }}>{service.title}</h3>
 <p style={{ color: colors.dark }}>{service.description}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* How It Works Section */}
<section
 id="how-it-works"
 style={{
 display: 'flex',
 alignItems: 'center',
 padding: '6rem 0',
 backgroundColor: colors.dark,
 opacity: isVisible['how-it-works'] ? 1 : 0,
 transform: isVisible['how-it-works'] ? 'translateY(0)' : 'translateY(20px)',
 transition: 'opacity 0.5s, transform 0.5s',
 }}
>
 {/* Left-Side Video */}
 <div style={{ flex: '1', position: 'relative', maxWidth: '600px', height: '100%', overflow: 'hidden' }}>
 <video
 autoPlay
 loop
 muted
 playsInline
 src="/video.mp4"
 style={{
 width: '160%',
 height: '160%',
 paddingLeft:'70px',
 objectFit: 'cover',
 borderRadius: '8px',
 boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
 }}
 />
 </div>

 {/* Right-Side Steps */}
 <div style={{ flex: '1', maxWidth: '600px', margin: '0 auto', paddingLeft: '2rem' }}>
 <h2
 style={{
 fontSize: '2.5rem',
 marginBottom: '2rem',
 textAlign: 'center',
 color: colors.white,
 animation: 'glow 2s infinite',
 }}
 >
 How It Works
 </h2>
 <div
 style={{
 display: 'flex',
 flexWrap: 'wrap',
 justifyContent: 'center',
 gap: '2rem',
 }}
 >
 {[
 { number: 1, title: 'Search', description: 'Enter your location and the service you need to find nearby mechanics.' },
 { number: 2, title: 'Compare', description: 'View profiles, ratings, and prices of nearby mechanics to make the best choice.' },
 { number: 3, title: 'Book', description: 'Select a mechanic and schedule your appointment at a time that suits you.' },
 { number: 4, title: 'Service', description: 'Get your vehicle serviced by a professional mechanic and enjoy peace of mind.' },
 ].map((step, index) => (
 <div key={index} style={{ flex: '1 1 250px', maxWidth: '250px', textAlign: 'center' }}>
 <div
 style={{
 width: '80px',
 height: '80px',
 borderRadius: '50%',
 backgroundColor: colors.primary,
 color: colors.white,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: '2rem',
 fontWeight: 'bold',
 margin: '0 auto 1rem',
 boxShadow: '0 4px 6px rgba(42, 157, 244, 0.3)',
 animation: `pulse 2s infinite ${index * 0.2}s, glow 3s infinite alternate ${index * 0.2}s, pop 0.5s ${index * 0.1}s`,
 }}
 >
 {step.number}
 </div>
 <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: colors.white }}>{step.title}</h3>
 <p style={{ color: colors.secondary }}>{step.description}</p>
 </div>
 ))}
 </div>
 </div>
</section>

{/* Testimonials Section */}
<section id="testimonials" style={{
 padding: '6rem 0',
 minHeight: '80vh', // Set a minimum height for the section
 backgroundColor: colors.light,
 opacity: isVisible.testimonials ? 1 : 0,
 transform: isVisible.testimonials ? 'translateY(0)' : 'translateY(20px)',
 transition: 'opacity 0.5s, transform 0.5s',
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center', // Center-align content horizontally
 justifyContent: 'center' // Center-align content vertically
}}>
 <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
 <h2 style={{
 fontSize: '2.5rem',
 marginBottom: '2rem',
 textAlign: 'center',
 color: colors.dark,
 animation: 'glow 2s infinite'
 }}>What Our Customers Say</h2>
 
 <div style={{
 display: 'flex',
 flexWrap: 'wrap',
 justifyContent: 'center',
 gap: '2rem'
 }}>
 {[
 { quote: "FIXIGO saved me so much time and hassle. I found a great mechanic in minutes!", author: "John D.", rating: 5 },
 { quote: "The mechanics on this platform are truly professional. I'm a satisfied repeat customer!", author: "Sarah M.", rating: 5 }
 ].map((testimonial, index) => (
 <div key={index} style={{
 flex: '1 1 300px',
 maxWidth: '400px',
 backgroundColor: colors.white,
 borderRadius: '8px',
 padding: '2rem',
 boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
 transition: 'all 0.3s',
 textAlign: 'center', // Center-align text within each testimonial card
 animation: `fadeIn 0.5s ease-out ${index * 0.2}s, borderRadiation 2s infinite ${index * 0.2}s, float 6s ease-in-out infinite ${index * 0.5}s`,
 ':hover': {
 transform: 'translateY(-10px) scale(1.03)',
 boxShadow: '0 12px 20px rgba(42, 157, 244, 0.2)'
 }
 }}>
 <p style={{
 fontSize: '1.1rem',
 fontStyle: 'italic',
 marginBottom: '1rem',
 color: colors.dark
 }}>"{testimonial.quote}"</p>
 
 <p style={{ fontWeight: 'bold', color: colors.dark }}>{testimonial.author}</p>
 
 <div style={{ color: colors.primary, marginTop: '0.5rem' }}>
 {[...Array(testimonial.rating)].map((_, i) => (
 <FaStar key={i} style={{
 marginRight: '0.25rem',
 animation: `pulse 1s infinite ${i * 0.1}s`
 }} />
 ))}
 </div>
 </div>
 ))}
 </div>
 </div>
</section>

 {/* Call to Action Section */}
<section id="cta" style={{
 padding: '6rem 0',
 minHeight: '50vh',
 display: 'flex',
 flexDirection: 'row', // Display items side by side
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: colors.primary,
 color: colors.white,
 textAlign: 'center',
 opacity: isVisible.cta ? 1 : 0,
 transform: isVisible.cta ? 'translateY(0)' : 'translateY(20px)',
 transition: 'opacity 0.5s, transform 0.5s'
}}>
 {/* Text Content */}
 <div style={{
 maxWidth: '800px',
 marginRight: '2rem', // Add some space between text and image
 textAlign: 'left' // Align text to the left within this div
 }}>
 <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'glow 2s infinite' }}>
 Ready to Find Your Mechanic?
 </h2>
 <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
 Join thousands of satisfied customers who have found reliable mechanics through our platform.
 </p>
 <Link to="/register" style={{
 backgroundColor: colors.secondary,
 color: colors.dark,
 padding: '0.75rem 1.5rem',
 borderRadius: '4px',
 textDecoration: 'none',
 fontSize: '1.1rem',
 fontWeight: 'bold',
 transition: 'all 0.3s',
 boxShadow: '0 4px 6px rgba(219, 213, 199, 0.2)',
 animation: 'pulse 2s infinite, borderRadiation 2s infinite',
 textAlign: 'center',
 ':hover': {
 backgroundColor: colors.white,
 color: colors.primary,
 transform: 'translateY(-5px) scale(1.05)',
 boxShadow: '0 8px 15px rgba(255, 255, 255, 0.3)'
 }
 }}>
 Get Started
 </Link>
 </div>

 {/* Image Content */}
 <div style={{
 maxWidth: '400px', // Set a maximum width for the image
 height: 'auto',
 textAlign: 'right' // Align image container to the right
 }}>
 <img src="/carImage.webp" alt="Mechanic illustration" style={{
 width: '120%',
 height:'130%',
 paddingRight:'100px',
 borderRadius: '8px',
 boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
 transition: 'transform 0.3s',
 ':hover': {
 transform: 'scale(1.05)' // Slightly enlarge image on hover
 }
 }} />
 </div>
</section>


 {/* Footer */}
{/* Footer */}
<footer style={{
 backgroundColor: colors.dark,
 color: colors.light,
 padding: '3rem 0',
 minHeight: '50vh',
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 animation: 'fadeIn 0.5s ease-out'
}}>
 <div style={{
 maxWidth: '1200px',
 width: '100%',
 display: 'flex',
 flexWrap: 'wrap',
 justifyContent: 'center',
 gap: '2rem'
 }}>
 {/* Brand Section */}
 <div style={{ flex: '1 1 300px', marginBottom: '2rem', textAlign: 'center' }}>
 <h5 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: colors.white, animation: 'glow 2s infinite' }}>FIXIGO</h5>
 <p style={{ fontSize: '1.3rem', color: colors.secondary }}>Connecting you with the best mechanics in your area.</p>
 
 {/* Social Media Section under Brand */}
 <div style={{
 display: 'flex',
 justifyContent: 'center',
 gap: '2rem',
 marginTop: '1rem' // Added some space between the text and the icons
 }}>
 <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
 color: colors.secondary,
 fontSize: '2.5rem',
 transition: 'color 0.3s',
 ':hover': { color: colors.primary }
 }}>
 <FaTwitter />
 </a>
 <a href="mailto:info@fixigo.com" style={{
 color: colors.secondary,
 fontSize: '2.5rem',
 transition: 'color 0.3s',
 ':hover': { color: colors.primary }
 }}>
 <FaEnvelope />
 </a>
 <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
 color: colors.secondary,
 fontSize: '2.5rem',
 transition: 'color 0.3s',
 ':hover': { color: colors.primary }
 }}>
 <FaInstagram />
 </a>
 </div>
 </div>
 
 {/* Quick Links Section */}
 <div style={{ flex: '1 1 300px', marginBottom: '2rem', textAlign: 'center' }}>
 <h5 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: colors.white }}>Quick Links</h5>
 <ul style={{ listStyle: 'none', padding: 0 }}>
 {['About', 'Services', 'How It Works', 'Contact'].map((item, index) => (
 <li key={index} style={{ marginBottom: '0.5rem' }}>
 <a href={`#${item.toLowerCase().replace(' ', '-')}`} style={{
 color: colors.secondary,
 textDecoration: 'none',
 fontSize: '1.3rem',
 transition: 'all 0.3s',
 ':hover': {
 color: colors.primary,
 transform: 'translateX(5px)'
 }
 }}>
 {item}
 </a>
 </li>
 ))}
 </ul>
 </div>
 
 {/* Contact Us Section */}
 <div style={{ flex: '1 1 300px', marginBottom: '2rem', textAlign: 'center' }}>
 <h5 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: colors.white }}>Contact Us</h5>
 <ul style={{ listStyle: 'none', padding: 0 }}>
 <li style={{ marginBottom: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.secondary }}>
 <FaEnvelope style={{ marginRight: '0.5rem', color: colors.primary, animation: 'pulse 2s infinite' }} /> info@fixigo.com
 </li>
 <li style={{ marginBottom: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.secondary }}>
 <FaPhone style={{ marginRight: '0.5rem', color: colors.primary, animation: 'pulse 2s infinite' }} /> (123) 456-7890
 </li>
 <li style={{ marginBottom: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.secondary }}>
 <FaMapMarkerAlt style={{ marginRight: '0.5rem', color: colors.primary, animation: 'pulse 2s infinite' }} /> 123 Mechanic Street, Auto City, AC 12345
 </li>
 </ul>
 </div>
 </div>

 {/* Copyright Section */}
 <div style={{
 borderTop: `1px solid ${colors.secondary}`,
 marginTop: '9rem',
 minHeight: '4vh',
 paddingTop: '2rem',
 textAlign: 'center',
 width: '100%'
 }}>
 <p style={{ fontSize: '1.3rem', color: colors.secondary }}>&copy; 2024 FIXIGO. All rights reserved.</p>
 </div>
</footer>



 </div>
 );
}

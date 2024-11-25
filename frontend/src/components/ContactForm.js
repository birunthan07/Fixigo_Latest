




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
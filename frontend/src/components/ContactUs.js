import React, { useState } from 'react';

const ContactUs = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would send the form data to a backend
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page-container">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <button 
              onClick={() => {
                onBack('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn btn-secondary"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                margin: '0 auto'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              Back to Home
            </button>
          </div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Contact Us
          </h1>
          <p style={{ color: '#aaa', fontSize: '1.1rem' }}>
            We'd love to hear from you
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            {/* Contact Information */}
            <div>
              <h2 style={{ color: '#6c5ce7', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                📞 Get in Touch
              </h2>
              
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#6c5ce7', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                  General Inquiries
                </h3>
                <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
                  <strong>Email:</strong> hello@maskchat.com
                </p>
                <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
                  <strong>Response Time:</strong> Within 24 hours
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#6c5ce7', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                  Technical Support
                </h3>
                <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
                  <strong>Email:</strong> support@maskchat.com
                </p>
                <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
                  <strong>Response Time:</strong> Within 12 hours
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#6c5ce7', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                  Safety & Reports
                </h3>
                <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
                  <strong>Email:</strong> safety@maskchat.com
                </p>
                <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
                  <strong>Response Time:</strong> Within 6 hours
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#6c5ce7', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                  Business & Partnerships
                </h3>
                <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
                  <strong>Email:</strong> business@maskchat.com
                </p>
                <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
                  <strong>Response Time:</strong> Within 48 hours
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 style={{ color: '#6c5ce7', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                💬 Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem' }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem' }}>
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="safety">Safety Report</option>
                    <option value="business">Business Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: '#ccc', display: 'block', marginBottom: '0.5rem' }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    marginTop: '1rem'
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1.5rem', fontSize: '1.5rem', textAlign: 'center' }}>
              ❓ Frequently Asked Questions
            </h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ 
                background: 'rgba(108, 92, 231, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px',
                border: '1px solid rgba(108, 92, 231, 0.3)'
              }}>
                <h3 style={{ color: '#6c5ce7', marginBottom: '0.5rem' }}>
                  How quickly do you respond?
                </h3>
                <p style={{ color: '#ccc', margin: 0 }}>
                  We aim to respond to all inquiries within 24 hours. Safety reports are prioritized and typically receive responses within 6 hours.
                </p>
              </div>

              <div style={{ 
                background: 'rgba(108, 92, 231, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px',
                border: '1px solid rgba(108, 92, 231, 0.3)'
              }}>
                <h3 style={{ color: '#6c5ce7', marginBottom: '0.5rem' }}>
                  Can I report inappropriate behavior?
                </h3>
                <p style={{ color: '#ccc', margin: 0 }}>
                  Yes! Please report any inappropriate behavior to safety@maskchat.com. We take all reports seriously and investigate promptly.
                </p>
              </div>

              <div style={{ 
                background: 'rgba(108, 92, 231, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px',
                border: '1px solid rgba(108, 92, 231, 0.3)'
              }}>
                <h3 style={{ color: '#6c5ce7', marginBottom: '0.5rem' }}>
                  Do you have a mobile app?
                </h3>
                <p style={{ color: '#ccc', margin: 0 }}>
                  MeetWorld is currently web-based and works great on mobile browsers. We're working on native mobile apps for iOS and Android.
                </p>
              </div>

              <div style={{ 
                background: 'rgba(108, 92, 231, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px',
                border: '1px solid rgba(108, 92, 231, 0.3)'
              }}>
                <h3 style={{ color: '#6c5ce7', marginBottom: '0.5rem' }}>
                  Is my data really not stored?
                </h3>
                <p style={{ color: '#ccc', margin: 0 }}>
                  Absolutely! We don't store any chat data, personal information, or conversation history. Everything is completely ephemeral.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

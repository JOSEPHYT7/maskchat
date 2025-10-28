import React from 'react';

const PrivacyPolicy = ({ onBack }) => {
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
            Privacy Policy
          </h1>
          <p style={{ color: '#aaa', fontSize: '1.1rem' }}>
            Your privacy is our top priority
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              🔒 Complete Anonymity
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              MeetWorld is designed with complete anonymity in mind. We do not collect, store, or process any personal information about our users.
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>No registration required</li>
              <li>No personal data collection</li>
              <li>No user accounts or profiles</li>
              <li>No tracking or analytics</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              💬 Chat Data
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              All conversations are completely ephemeral and are not stored on our servers.
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>Messages are not saved or logged</li>
              <li>Video calls are peer-to-peer (no server recording)</li>
              <li>No chat history is maintained</li>
              <li>Conversations disappear when ended</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              🌐 Technical Information
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              We only collect minimal technical data necessary for the service to function.
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>Connection status (online/offline)</li>
              <li>Chat type preference (text/video)</li>
              <li>Session duration (not linked to identity)</li>
              <li>No IP address logging</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              🛡️ Data Protection
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              We implement industry-standard security measures to protect any minimal data we process.
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>End-to-end encryption for all communications</li>
              <li>No data retention policies</li>
              <li>Secure server infrastructure</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              📱 Third-Party Services
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              We do not share any data with third parties. Our service is completely self-contained.
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>No advertising networks</li>
              <li>No analytics services</li>
              <li>No social media integration</li>
              <li>No data brokers</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              🔄 Your Rights
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              Since we don't collect personal data, there's no personal information to access, modify, or delete.
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>No data to access (we don't collect any)</li>
              <li>No data to modify (we don't store any)</li>
              <li>No data to delete (we don't retain any)</li>
              <li>Complete privacy by design</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              📞 Contact Us
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              If you have any questions about this Privacy Policy, please contact us.
            </p>
            <div style={{ 
              background: 'rgba(108, 92, 231, 0.1)', 
              padding: '1rem', 
              borderRadius: '10px',
              border: '1px solid rgba(108, 92, 231, 0.3)'
            }}>
              <p style={{ color: '#ccc', margin: 0 }}>
                <strong>Email:</strong> privacy@maskchat.com<br/>
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </div>
          </section>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '3rem',
            padding: '1.5rem',
            background: 'rgba(108, 92, 231, 0.1)',
            borderRadius: '15px',
            border: '1px solid rgba(108, 92, 231, 0.3)'
          }}>
            <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}<br/>
              This policy is effective immediately and applies to all users of MeetWorld.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

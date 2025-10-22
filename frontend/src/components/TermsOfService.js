import React from 'react';

const TermsOfService = ({ onBack }) => {
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
            Terms of Service
          </h1>
          <p style={{ color: '#aaa', fontSize: '1.1rem' }}>
            Please read these terms carefully before using Mask Chat
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              📋 Acceptance of Terms
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              By accessing and using Mask Chat, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              🎭 Service Description
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              Mask Chat is an anonymous, ephemeral chat platform that connects users for real-time conversations.
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>Anonymous text and video chat</li>
              <li>No registration or account required</li>
              <li>No data storage or chat history</li>
              <li>Peer-to-peer video connections</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              ✅ User Responsibilities
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              Users are responsible for their behavior and content shared during conversations.
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>Be respectful and courteous to other users</li>
              <li>Do not share inappropriate, illegal, or harmful content</li>
              <li>Do not attempt to identify or track other users</li>
              <li>Report any abusive behavior immediately</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              🚫 Prohibited Activities
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              The following activities are strictly prohibited on Mask Chat:
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>Harassment, bullying, or threatening behavior</li>
              <li>Sharing explicit, violent, or disturbing content</li>
              <li>Attempting to bypass anonymity features</li>
              <li>Spamming or flooding the chat system</li>
              <li>Sharing personal information of others</li>
              <li>Any illegal activities or content</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              ⚖️ Service Availability
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              We strive to provide reliable service, but cannot guarantee uninterrupted access.
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>Service may be temporarily unavailable for maintenance</li>
              <li>We reserve the right to modify or discontinue the service</li>
              <li>No compensation for service interruptions</li>
              <li>Users are responsible for their internet connection</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              🛡️ Limitation of Liability
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              Mask Chat is provided "as is" without warranties of any kind.
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>We are not responsible for user interactions or content</li>
              <li>No liability for technical issues or service interruptions</li>
              <li>Users participate at their own risk</li>
              <li>We do not monitor or moderate conversations</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              🔄 Modifications
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              We reserve the right to modify these terms at any time. Continued use constitutes acceptance of changes.
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>Terms may be updated without prior notice</li>
              <li>Users should review terms periodically</li>
              <li>Significant changes will be announced</li>
              <li>Continued use implies acceptance</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              📞 Contact Information
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              For questions about these Terms of Service, please contact us.
            </p>
            <div style={{ 
              background: 'rgba(108, 92, 231, 0.1)', 
              padding: '1rem', 
              borderRadius: '10px',
              border: '1px solid rgba(108, 92, 231, 0.3)'
            }}>
              <p style={{ color: '#ccc', margin: 0 }}>
                <strong>Email:</strong> legal@maskchat.com<br/>
                <strong>Response Time:</strong> Within 48 hours
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
              These terms are effective immediately and apply to all users of Mask Chat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

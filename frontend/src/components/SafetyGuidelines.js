import React from 'react';

const SafetyGuidelines = ({ onBack }) => {
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
            Safety Guidelines
          </h1>
          <p style={{ color: '#aaa', fontSize: '1.1rem' }}>
            Stay safe while connecting with strangers
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              🛡️ General Safety Tips
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              Your safety is our priority. Follow these guidelines to have a positive experience on Mask Chat.
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>Never share personal information (name, address, phone number, etc.)</li>
              <li>Be cautious about sharing photos or videos</li>
              <li>Trust your instincts - if something feels wrong, end the conversation</li>
              <li>Remember that you're talking to strangers</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              🚫 What Not to Share
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              Keep your personal information private at all times.
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>Full name or real identity</li>
              <li>Home address or location</li>
              <li>Phone number or email address</li>
              <li>Social media profiles</li>
              <li>School or workplace information</li>
              <li>Financial information</li>
              <li>Personal photos that could identify you</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              ⚠️ Red Flags to Watch For
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              Be alert for these warning signs and end the conversation immediately if you encounter them.
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>Asking for personal information repeatedly</li>
              <li>Requesting photos or videos</li>
              <li>Asking to meet in person</li>
              <li>Inappropriate or sexual content</li>
              <li>Threatening or aggressive behavior</li>
              <li>Attempting to move the conversation to another platform</li>
              <li>Asking for money or financial help</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              🔄 How to Handle Problems
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              If you encounter inappropriate behavior, here's what to do:
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li><strong>End the conversation immediately</strong> - Use the "Stop Chat" button</li>
              <li><strong>Don't engage</strong> - Don't argue or try to reason with them</li>
              <li><strong>Report if necessary</strong> - Contact us if the behavior is severe</li>
              <li><strong>Take a break</strong> - Step away from the platform if needed</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              📱 Video Chat Safety
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              Additional precautions for video conversations:
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>Be mindful of your background - avoid showing personal items</li>
              <li>Consider using a virtual background if available</li>
              <li>Dress appropriately for video calls</li>
              <li>Be aware of what's visible in your camera view</li>
              <li>You can turn off your video at any time</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              🆘 When to Report
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              Report users who engage in the following behaviors:
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>Sharing inappropriate or illegal content</li>
              <li>Harassment or bullying</li>
              <li>Attempting to identify or track users</li>
              <li>Threatening behavior</li>
              <li>Spam or flooding</li>
              <li>Any behavior that makes you feel unsafe</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              💡 Positive Interactions
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              Tips for having great conversations:
            </p>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>Be respectful and kind</li>
              <li>Ask open-ended questions</li>
              <li>Listen actively to what others say</li>
              <li>Share interesting topics or stories</li>
              <li>Be open to different perspectives</li>
              <li>Remember that everyone is human</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem', fontSize: '1.5rem' }}>
              📞 Emergency Resources
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              If you're in immediate danger or need help:
            </p>
            <div style={{ 
              background: 'rgba(255, 107, 107, 0.1)', 
              padding: '1rem', 
              borderRadius: '10px',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              marginBottom: '1rem'
            }}>
              <p style={{ color: '#ccc', margin: 0, fontWeight: 'bold' }}>
                🚨 Emergency: Call 911 (US) or your local emergency number
              </p>
            </div>
            <ul style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
              <li>National Suicide Prevention Lifeline: 988</li>
              <li>Crisis Text Line: Text HOME to 741741</li>
              <li>National Domestic Violence Hotline: 1-800-799-7233</li>
              <li>Report to local authorities if needed</li>
            </ul>
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
              <strong>Remember:</strong> Your safety comes first. When in doubt, end the conversation and take a break.<br/>
              If you need to report someone, contact us at safety@maskchat.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyGuidelines;

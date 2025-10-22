import React from 'react';

const Modal = ({ isOpen, onClose, title, children, type = 'default' }) => {
  if (!isOpen) return null;

  const getModalStyles = () => {
    const baseStyles = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    };

    if (type === 'create') {
      return {
        ...baseStyles,
        backgroundColor: 'rgba(108, 92, 231, 0.1)'
      };
    } else if (type === 'join') {
      return {
        ...baseStyles,
        backgroundColor: 'rgba(116, 185, 255, 0.1)'
      };
    }
    return baseStyles;
  };

  const getContentStyles = () => {
    const baseStyles = {
      background: 'rgba(30, 30, 46, 0.95)',
      borderRadius: '20px',
      padding: '30px',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative'
    };

    if (type === 'create') {
      return {
        ...baseStyles,
        border: '1px solid rgba(108, 92, 231, 0.3)',
        boxShadow: '0 20px 40px rgba(108, 92, 231, 0.2)'
      };
    } else if (type === 'join') {
      return {
        ...baseStyles,
        border: '1px solid rgba(116, 185, 255, 0.3)',
        boxShadow: '0 20px 40px rgba(116, 185, 255, 0.2)'
      };
    }
    return baseStyles;
  };

  const getTitleColor = () => {
    if (type === 'create') return '#6c5ce7';
    if (type === 'join') return '#74b9ff';
    return '#ffffff';
  };

  return (
    <div style={getModalStyles()} onClick={onClose}>
      <div 
        style={getContentStyles()} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: '#aaa',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '50%',
            width: '35px',
            height: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'none';
            e.target.style.color = '#aaa';
          }}
        >
          ×
        </button>

        {/* Title */}
        {title && (
          <h3 style={{ 
            color: getTitleColor(), 
            marginBottom: '20px', 
            fontSize: '1.5rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            {title}
          </h3>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;

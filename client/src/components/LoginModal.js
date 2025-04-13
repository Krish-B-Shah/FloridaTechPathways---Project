import React from 'react';
import Login from './Login';

function LoginModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6">
        <Login onClose={onClose} />
      </div>
    </div>
  );
}

export default LoginModal;
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Add Internship</h2>
          <button onClick={onClose} className="text-red-600 font-bold">X</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;

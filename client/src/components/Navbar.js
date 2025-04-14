import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onOpenAddModal }) => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="px-6 py-3 flex items-center">
        <Link to="/" className="flex items-center space-x-2">
          <svg 
            className="h-8 w-8" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
          <h1 className="text-xl font-bold">Trackship</h1>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
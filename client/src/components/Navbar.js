import React from 'react';
import { Sun, Moon } from 'lucide-react'; // Import Sun and Moon icons

const Navbar = ({ onOpenAddModal, theme, toggleTheme }) => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left-aligned Trackship */}
          <div className="flex-grow text-left justify-left">
            <span className="font-bold text-xl text-left">Trackship</span>
          </div>
          
          {/* Right-aligned items */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

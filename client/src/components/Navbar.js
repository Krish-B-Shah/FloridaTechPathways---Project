import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, User, PlusCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';

const Navbar = ({ onOpenAddModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
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

          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <div className="relative">
                  <button 
                    onClick={toggleMenu}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      {currentUser.photoURL ? (
                        <img 
                          src={currentUser.photoURL} 
                          alt="Profile" 
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <span>{currentUser.displayName || 'User'}</span>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link 
                        to="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/signin" className="hover:text-blue-200 transition-colors">Sign In</Link>
                <Link to="/signup" className="px-3 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors">Sign Up</Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>


        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-500 pt-2 pb-3 space-y-1">
            {currentUser ? (
              <>
                <div className="px-4 py-2 text-blue-200">
                  <p className="text-sm">Signed in as:</p>
                  <p className="font-medium">{currentUser.displayName || currentUser.email}</p>
                </div>
                <Link 
                  to="/dashboard" 
                  className="block px-4 py-2 text-white hover:bg-blue-700 rounded-md w-full text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={onOpenAddModal}
                  className="flex items-center px-4 py-2 text-white hover:bg-blue-700 rounded-md w-full text-left"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Internship
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-white hover:bg-blue-700 rounded-md w-full text-left"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  className="block px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
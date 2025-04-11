import React from 'react';
import { createRoot } from 'react-dom/client';  // Note the change here
import './index.css';
import App from './App';

// Get the root element
const rootElement = document.getElementById('root');

// Create a root
const root = createRoot(rootElement);

// Render your app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
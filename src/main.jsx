import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0b1220',
            color: '#e5f9ff',
            border: '1px solid rgba(46, 211, 255, 0.25)'
          }
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);

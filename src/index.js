import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Make sure this path is correct
import App from './App';
import { CssBaseline } from '@mui/material';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from './Redux/store';

import process from 'process';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <HelmetProvider>
      <CssBaseline />
      <App />
    </HelmetProvider>
  </Provider>
);

reportWebVitals();

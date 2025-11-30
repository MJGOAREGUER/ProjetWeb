import React from 'react';
import ReactDOM from 'react-dom/client';
import './ressources/index.css';
import App from './App';
import PopupProvider from "./components/Popup";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PopupProvider>
      <App />
    </PopupProvider>
  </React.StrictMode>
);

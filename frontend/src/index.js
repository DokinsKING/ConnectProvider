import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Импортируем BrowserRouter
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
document.body.style.backgroundColor = "#b18d5e";

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Import all themes
import './themes/default.css'
import './themes/colorful.css'
import './themes/elegant.css'
import './themes/dark.css'

// Initialize animations
import './utils/animations.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


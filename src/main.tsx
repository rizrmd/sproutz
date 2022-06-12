import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { jsx,css } from '@emotion/react'

const w = window as any
w.jsx = jsx
w.css = css
w.React = React
w.Fragment = React.Fragment

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

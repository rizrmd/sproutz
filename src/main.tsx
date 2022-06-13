import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import './index.css'
import { jsx, css as _css } from '@emotion/react'
import _tauri from '@tauri-apps/api'

const w = window as any
w.jsx = jsx
w.css = _css
w.React = React
w.Fragment = React.Fragment
w.tauri = w.__TAURI__
w.gql = function (t: any) {
  for (var s = t[0], i = 1, l = arguments.length; i < l; i++) {
    s += arguments[i] + t[i]
  }

  return s
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)

declare global {
  const tauri: typeof _tauri
  const gql: any
  const css: typeof _css
}

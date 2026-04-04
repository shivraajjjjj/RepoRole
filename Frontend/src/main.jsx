import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App/App.css'
import store from './App/app.store.js'
import App from './Feature/Pages/App.jsx'
import {Provider} from 'react-redux'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </StrictMode>,
)

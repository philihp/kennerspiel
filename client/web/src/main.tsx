import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'

import 'react-toastify/dist/ReactToastify.css'
import { HathoraContextProvider } from './context/GameContext'
import { App } from './App'
import './index.css'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="843500347511-jd10djb45kpf7r9gl6hial3mbds03o2f.apps.googleusercontent.com">
    <HathoraContextProvider>
      <App />
    </HathoraContextProvider>
  </GoogleOAuthProvider>
)

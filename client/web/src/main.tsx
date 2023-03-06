import ReactDOM from 'react-dom/client'

import 'react-toastify/dist/ReactToastify.css'
import { HathoraContextProvider } from './context/GameContext'
import { App } from './App'
import './index.css'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <HathoraContextProvider>
    <App />
  </HathoraContextProvider>
)

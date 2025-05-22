import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { UserContextProvider } from './context/UserContext.jsx'
import { CaptainContextProvider } from './context/CaptainContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'
import { ChatContextProvider } from './context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <CaptainContextProvider>
    <UserContextProvider>
      <SocketContextProvider>
        <ChatContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ChatContextProvider>
      </SocketContextProvider>
    </UserContextProvider>
  </CaptainContextProvider>
  // </StrictMode>,
)

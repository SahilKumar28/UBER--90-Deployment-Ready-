import { Route, Routes } from 'react-router-dom'
import './index.css'
import React from 'react'
import Home from './components/home'
import Login from './components/login'
import Register from './components/register'
import Captain_Register from './components/Captain_Register'
import VerifyEmail from './components/VerifyEmail'
import Start from './components/Start'
import ProtectedWrapper from './components/ProtectedWrapper'
import Logout from './components/Logout'
import No_Login_If_Token from './components/No_Login_If_Token'
import Captain_UI from './components/Captain_UI'
import Captain_check from './components/captain_check'



const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={ <No_Login_If_Token> <Login /></No_Login_If_Token>} />
        <Route path='/register' element={<Register />} />
        <Route path='/captainregister' element={<Captain_Register />}/>
        <Route path='/captain' element={ <Captain_check>  <Captain_UI /> </Captain_check>} />
        <Route path='/start' element={<ProtectedWrapper> <Start /> </ProtectedWrapper>} />
        <Route path='/logout' element={<ProtectedWrapper> <Logout /> </ProtectedWrapper>} />
      </Routes>
    </div>
  )
}

export default App
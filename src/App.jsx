import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Homepage from './components/Homepage'
import Login from './components/Login'
import { Route, Routes } from 'react-router'
import Signup from './components/Signup'
import Profile from './components/Profile'
import BookMark from './components/BookMark'

function App() {

  return (
    <div>
      <Routes>
          <Route path='/blog' element={<Homepage/>}/>
          <Route path='/' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/myprofile/:userId' element={<Profile/>}/>
          <Route path='/bookmarks' element={<BookMark/>}/>
      </Routes>
    </div>
  )
}

export default App

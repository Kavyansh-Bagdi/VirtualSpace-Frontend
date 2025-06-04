import './App.css'
import React from 'react'
import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Game from './pages/Game';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<React.StrictMode><HomePage /></React.StrictMode>} />
        <Route path="/auth" element={<React.StrictMode><AuthPage /></React.StrictMode>} />
        <Route path="/profile" element={<React.StrictMode><Profile /></React.StrictMode>}></Route>
        <Route path="/space" element={<Game />}></Route>

      </Routes>
    </Suspense>
  )
}

export default App

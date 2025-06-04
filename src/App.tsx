import './App.css'
import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<Profile />}></Route>
      </Routes>
    </Suspense>
  )
}

export default App

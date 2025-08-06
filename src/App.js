import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup_page/signup';
import LoginPage from './components/loginpage/loginpage';
import StudentPage from './components/pages/StudentPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route will redirect to signup */}
        <Route path="/" element={<Navigate to="/signup" />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />
     
       <Route path="/students" element={<StudentPage />} />
      </Routes>
    </Router>
  );
}

export default App;

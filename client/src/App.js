// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatbotEN from './components/ChatbotEN';
import ChatbotRO from './components/ChatbotRO';
import ChatbotES from './components/ChatbotES';
import HomeButton from './components/HomeButton';
import LanguageSelector from './components/LanguageSelector';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <HomeButton />
          <h1>Secant Chatbot</h1>
          <LanguageSelector />
        </header>
        <main>
          <Routes>
            <Route path="/chatbot" element={<Navigate to="/chatbot_en" replace />} />
            <Route path="/chatbot_en" element={<ChatbotEN />} />
            <Route path="/chatbot_ro" element={<ChatbotRO />} />
            <Route path="/chatbot_es" element={<ChatbotES/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

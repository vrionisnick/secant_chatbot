import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 style={{ color: 'orange' }}>Welcome to the Secant Chatbot Evaluation</h1>
        </header>
        <main>
          <Routes>
            {/* Define the route for Chatbot within Routes */}
            <Route path="/chatbot" element={<Chatbot />} />
            {/* You can add more Route components here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

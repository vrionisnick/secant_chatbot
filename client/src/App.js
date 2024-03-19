import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import HomeButton from './components/HomeButton'; // Import HomeButton component
import './App.css'; // Import global styles

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 style={{ color: 'orange' }}>Welcome to the Secant Chatbot Evaluation</h1>
        </header>
        <main>
          <Routes>
            <Route path="/chatbot" element={<Chatbot />} />
          </Routes>
          <HomeButton /> {/* Render the HomeButton component */}
        </main>
      </div>
    </Router>
  );
}

export default App;

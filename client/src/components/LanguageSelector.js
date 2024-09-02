import React from 'react';
import { useNavigate } from 'react-router-dom';
import enImage from '../images/EN.png';
import roImage from '../images/RO.png';
import esImage from '../images/ES.png';

function LanguageSelector() {
  const navigate = useNavigate();
  
  return (
    <div className="language-selector">
      <button 
        className="language-button" 
        onClick={() => navigate('/chatbot_en')} 
        style={{ backgroundImage: `url(${enImage})` }}
        data-language="English">
      </button>
      <button 
        className="language-button" 
        onClick={() => navigate('/chatbot_ro')} 
        style={{ backgroundImage: `url(${roImage})` }}
        data-language="Română">
      </button>
      <button 
        className="language-button" 
        onClick={() => navigate('/chatbot_es')} 
        style={{ backgroundImage: `url(${esImage})` }}
        data-language="Español">
      </button>
    </div>
  );
}

export default LanguageSelector;

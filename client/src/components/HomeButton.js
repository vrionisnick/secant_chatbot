import React from 'react';
import '../css/HomeButton.css'; // Import the CSS file

const HomeButton = () => {
  const handleClick = () => {
    window.location.href = 'https://seua.vercel.app/home'; // Redirect to Secant End User Application
  };

  return (
    <div className="home-button-container">
      <button className="home-button" onClick={handleClick}>
        SEUA
      </button>
    </div>
  );
};

export default HomeButton;

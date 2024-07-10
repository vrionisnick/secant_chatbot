import React from 'react';
import '../css/HomeButton.css'; // Import the CSS file

const HomeButton = () => {
  const handleButtonClick = () => {
    window.open("https://seua.vercel.app/home", "_blank");
  };

  return (
    <div className="home-button-container">
      <button className="home-button" onClick={handleButtonClick}>
        SEUA
      </button>
    </div>
  );
};

export default HomeButton;

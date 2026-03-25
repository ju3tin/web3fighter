// components/SettingsMenu.js

import { useState } from 'react';
import styles from './SettingsMenu.module.css'; // Import CSS for animation

const SettingsMenu = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isGamePaused, setGamePaused] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
    setGamePaused(!isGamePaused);
    
    if (isGamePaused) {
      // Resume the game logic here (e.g., unfreeze game timers, interactions)
      console.log("Game Resumed");
    } else {
      // Pause the game logic here (e.g., freeze game timers, interactions)
      console.log("Game Paused");
    }
  };

  return (
    <div>
      {/* Settings Button */}
      <button 
        onClick={toggleMenu} 
        className={styles.settingsButton}>
        Settings
      </button>

      {/* Settings Menu */}
      <div className={`${styles.settingsMenu} ${isMenuOpen ? styles.open : ''}`}>
        <h3>Settings</h3>
        <ul>
          <li>Audio</li>
          <li>Controls</li>
          <li>Graphics</li>
          {/* Add your settings options here */}
        </ul>
        <button onClick={toggleMenu}>Close</button>
      </div>

      {/* Optionally, you can hide the game UI when the menu is open */}
      <div className={isMenuOpen ? styles.gameUIHidden : ''}>
        {/* Your game content goes here */}
        <h2>Game Content</h2>
      </div>
    </div>
  );
};

export default SettingsMenu;

// components/SettingsMenu.js

import { useState } from 'react';
import styles from './SettingsMenu.module.css'; // Import the CSS for styling and animation

const SettingsMenu = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {/* Settings Tab */}
      <div 
        onClick={toggleMenu} 
        className={`${styles.settingsTab} ${isMenuOpen ? styles.open : ''}`}
      >
        Settings
      </div>

      {/* Settings Menu (Hidden by default, slides up when active) */}
      <div className={`${styles.settingsMenu} ${isMenuOpen ? styles.open : ''}`}>
        <button className={styles.closeButton} onClick={toggleMenu}>X</button>
        <h3>Settings</h3>
        <ul>
          <li>Audio</li>
          <li>Controls</li>
          <li>Graphics</li>
          {/* Add your settings options here */}
        </ul>
      </div>
    </div>
  );
};

export default SettingsMenu;

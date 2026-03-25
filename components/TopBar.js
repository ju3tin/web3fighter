// components/TopBar.js
import React from 'react';
import styles from './TopBar.module.css'; // We'll use CSS modules for styling

const TopBar = () => {
  return (
    <div className={styles.topBar}>
      <button className={styles.backBtn}>Back</button>
      <button className={styles.loginBtn}>Login</button>
    </div>
  );
};

export default TopBar;

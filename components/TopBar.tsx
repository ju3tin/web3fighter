// components/TopBar.tsx
'use client'
import React from 'react';
import styles from './TopBar.module.css';

// Define the types for the props if needed, for now, we'll just assume no props
const TopBar: React.FC = () => {
  return (
    <div className={styles.topBar}>
      <button className={styles.backBtn}>Back</button>
      <button className={styles.loginBtn}>Login</button>
    </div>
  );
};

export default TopBar;

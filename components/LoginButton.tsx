"use client";

import { useState } from "react";
import styles from "./LoginButton.module.css"; // or use Tailwind if you prefer

export default function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Login Button */}
      <button className={styles.loginBtn} onClick={() => setIsOpen(true)}>
        {/* Optional icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
        </svg>
        Login
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>

            <h2>Login Instructions</h2>

            <div className={styles.instructions}>
              <p>1. Enter your email address</p>
              <p>2. Enter your password</p>
              <p>3. Click the Login button</p>
              <p>Forgot password? Click “Reset Password”</p>
            </div>

            <form className={styles.form}>
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <button type="submit" className={styles.submitBtn}>
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
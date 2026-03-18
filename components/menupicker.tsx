// components/WheelPicker.tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./WheelPicker.module.css"; // we'll create this CSS module next

interface WheelPickerProps {
  // You can make this customizable later if needed
  items?: Record<string, string>;
}

export default function WheelPicker({ items }: WheelPickerProps = {}) {
  // Default routes (you can override by passing props)
  const defaultRoutes = {
    "Start Game": "/play", 
    "Tutorial": "/tutorial",
    "Marketplace": "/shop",
    "Settings": "/settings",
    "Credits": "/credits",
    "Leaderboard": "/leaderboard",
    "About": "/about",
  };

  const routes = items || defaultRoutes;
  const values = Object.keys(routes);

  const pickerRef = useRef<HTMLDivElement>(null);

  // Build the repeating wheel content once
  useEffect(() => {
    const picker = pickerRef.current;
    if (!picker) return;

    // Clear previous content (useful for hot-reload / re-mount)
    picker.innerHTML = "";

    const itemHeight = 40;
    const repeatCount = 5; // enough to make it feel infinite

    // Top spacer
    const topSpacer = document.createElement("div");
    topSpacer.className = styles.spacer;
    picker.appendChild(topSpacer);

    // Repeated items
    for (let r = 0; r < repeatCount; r++) {
      values.forEach((label) => {
        const link = document.createElement("a");
        link.className = styles.item;
        link.textContent = label;
        link.href = routes[label];
        picker.appendChild(link);
      });
    }

    // Bottom spacer
    const bottomSpacer = document.createElement("div");
    bottomSpacer.className = styles.spacer;
    picker.appendChild(bottomSpacer);

    // Start scrolled so middle section is visible
    const singleSetHeight = values.length * itemHeight;
    picker.scrollTop = singleSetHeight * 2;

    // Infinite scroll loop
    const handleScroll = () => {
      if (!picker) return;

      if (picker.scrollTop < singleSetHeight) {
        picker.scrollTop += singleSetHeight;
      }
      if (picker.scrollTop > singleSetHeight * 3) {
        picker.scrollTop -= singleSetHeight;
      }
    };

    picker.addEventListener("scroll", handleScroll);
    return () => picker.removeEventListener("scroll", handleScroll);
  }, [values, routes]); // re-run if items change

  const scrollUp = () => {
    if (pickerRef.current) {
      pickerRef.current.scrollBy({ top: -40, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (pickerRef.current) {
      pickerRef.current.scrollBy({ top: +40, behavior: "smooth" });
    }
  };

  return (
   
    
    <div className={(styles.wrapper, styles.center)}>
      <div className={styles.arrow} onClick={scrollUp}>
        ▲
      </div>

      <div className={styles.highlight} />

      <div ref={pickerRef} className={styles.picker}>
        {/* Content is built via useEffect */}
      </div>

      <div className={styles.arrow} onClick={scrollDown}>
        ▼
      </div>
      </div>
  
  );
}
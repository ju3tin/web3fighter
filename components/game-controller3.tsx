import { useState, useEffect } from 'react';

const KeyPressComponent = () => {
  // Initialize the state for 8 buttons (4 standard + 4 directional)
  const [keyPressed, setKeyPressed] = useState({
    keyA: false,
    keyB: false,
    keyC: false,
    keyD: false,
    up: false,
    down: false,
    left: false,
    right: false,
  });

  // Handle keydown events (when a key is pressed)
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'a':
        setKeyPressed((prevState) => ({ ...prevState, keyA: true }));
        break;
      case 'b':
        setKeyPressed((prevState) => ({ ...prevState, keyB: true }));
        break;
      case 'c':
        setKeyPressed((prevState) => ({ ...prevState, keyC: true }));
        break;
      case 'd':
        setKeyPressed((prevState) => ({ ...prevState, keyD: true }));
        break;
      case 'ArrowUp':
      case 'w':
        setKeyPressed((prevState) => ({ ...prevState, up: true }));
        break;
      case 'ArrowDown':
      case 's':
        setKeyPressed((prevState) => ({ ...prevState, down: true }));
        break;
      case 'ArrowLeft':
      case 'a':
        setKeyPressed((prevState) => ({ ...prevState, left: true }));
        break;
      case 'ArrowRight':
      case 'd':
        setKeyPressed((prevState) => ({ ...prevState, right: true }));
        break;
      default:
        break;
    }
  };

  // Handle keyup events (when a key is released)
  const handleKeyUp = (event) => {
    switch (event.key) {
      case 'a':
        setKeyPressed((prevState) => ({ ...prevState, keyA: false }));
        break;
      case 'b':
        setKeyPressed((prevState) => ({ ...prevState, keyB: false }));
        break;
      case 'c':
        setKeyPressed((prevState) => ({ ...prevState, keyC: false }));
        break;
      case 'd':
        setKeyPressed((prevState) => ({ ...prevState, keyD: false }));
        break;
      case 'ArrowUp':
      case 'w':
        setKeyPressed((prevState) => ({ ...prevState, up: false }));
        break;
      case 'ArrowDown':
      case 's':
        setKeyPressed((prevState) => ({ ...prevState, down: false }));
        break;
      case 'ArrowLeft':
      case 'a':
        setKeyPressed((prevState) => ({ ...prevState, left: false }));
        break;
      case 'ArrowRight':
      case 'd':
        setKeyPressed((prevState) => ({ ...prevState, right: false }));
        break;
      default:
        break;
    }
  };

  // Count how many buttons are pressed at once
  const countPressedButtons = () => {
    return Object.values(keyPressed).filter(Boolean).length;
  };

  // Add event listeners when the component mounts
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup event listeners when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div>
      <h1>Press keys to test</h1>
      <p>
        A is {keyPressed.keyA ? 'pressed' : 'not pressed'}<br />
        B is {keyPressed.keyB ? 'pressed' : 'not pressed'}<br />
        C is {keyPressed.keyC ? 'pressed' : 'not pressed'}<br />
        D is {keyPressed.keyD ? 'pressed' : 'not pressed'}<br />
        Up is {keyPressed.up ? 'pressed' : 'not pressed'}<br />
        Down is {keyPressed.down ? 'pressed' : 'not pressed'}<br />
        Left is {keyPressed.left ? 'pressed' : 'not pressed'}<br />
        Right is {keyPressed.right ? 'pressed' : 'not pressed'}<br />
      </p>
      <h2>Total buttons pressed: {countPressedButtons()}</h2>
    </div>
  );
};

export default KeyPressComponent;

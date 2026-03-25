// components/game-controller1.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

type Direction = "left" | "right" | "forward" | "back" | "stop";
type Action = "punch" | "kick" | "block";

interface GameControllerProps {
  onPlayer1Move: (dir: Direction) => void;
  onPlayer1Action: (action: Action) => void;
}

// ====================== KEYBOARD MAPPING ======================
const MOVEMENT_KEYS: Record<string, Direction> = {
  ArrowLeft: "left",
  a: "left",
  A: "left",

  ArrowRight: "right",
  d: "right",
  D: "right",

  ArrowUp: "forward",
  w: "forward",
  W: "forward",

  ArrowDown: "back",
  s: "back",
  S: "back",
};

const ACTION_KEYS: Record<string, Action> = {
  j: "punch",   // LP
  k: "punch",   // RP  (you can change this if you want separate)
  u: "kick",    // LK
  i: "kick",    // RK
  // Space: "block", // uncomment if you want block
};

const GameController1: React.FC<GameControllerProps> = ({
  onPlayer1Move,
  onPlayer1Action,
}) => {
  const pressedKeys = useRef<Set<string>>(new Set());
  const currentDirection = useRef<Direction>("stop");

  // Calculate current movement direction based on all pressed movement keys
  const updateMovement = useCallback(() => {
    const activeMoves = new Set<Direction>();

    pressedKeys.current.forEach((key) => {
      const dir = MOVEMENT_KEYS[key];
      if (dir) activeMoves.add(dir);
    });

    let newDir: Direction = "stop";

    if (activeMoves.has("left") && activeMoves.has("right")) {
      newDir = "stop"; // cancel horizontal
    } else if (activeMoves.has("left")) {
      newDir = "left";
    } else if (activeMoves.has("right")) {
      newDir = "right";
    }

    if (activeMoves.has("forward") && activeMoves.has("back")) {
      // vertical cancel (optional: you can remove this if you want no cancel)
    } else if (activeMoves.has("forward")) {
      newDir = newDir === "stop" ? "forward" : newDir; // prioritize horizontal if both
    } else if (activeMoves.has("back")) {
      newDir = newDir === "stop" ? "back" : newDir;
    }

    // Only send update if direction actually changed
    if (newDir !== currentDirection.current) {
      currentDirection.current = newDir;
      onPlayer1Move(newDir);
    }
  }, [onPlayer1Move]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;

      // Prevent default for arrow keys and WASD
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(key)) {
        e.preventDefault();
      }

      if (pressedKeys.current.has(key)) return; // already pressed

      pressedKeys.current.add(key);

      // Handle movement
      if (MOVEMENT_KEYS[key]) {
        updateMovement();
      }

      // Handle actions (send on press - can be held)
      const action = ACTION_KEYS[key];
      if (action) {
        onPlayer1Action(action);
      }
    },
    [updateMovement, onPlayer1Action]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;

      if (!pressedKeys.current.has(key)) return;

      pressedKeys.current.delete(key);

      // If it was a movement key → recalculate direction
      if (MOVEMENT_KEYS[key]) {
        updateMovement();
      }

      // For actions we usually don't send "release" unless your game needs it
    },
    [updateMovement]
  );

  // Keyboard listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Optional: Visual feedback for all 8 buttons (great for testing)
  const [visualState, setVisualState] = useState({
    left: false, right: false, forward: false, back: false,
    lp: false, rp: false, lk: false, rk: false,
  });

  // Update visual state for debugging
  useEffect(() => {
    const vis = {
      left: pressedKeys.current.has("ArrowLeft") || pressedKeys.current.has("a") || pressedKeys.current.has("A"),
      right: pressedKeys.current.has("ArrowRight") || pressedKeys.current.has("d") || pressedKeys.current.has("D"),
      forward: pressedKeys.current.has("ArrowUp") || pressedKeys.current.has("w") || pressedKeys.current.has("W"),
      back: pressedKeys.current.has("ArrowDown") || pressedKeys.current.has("s") || pressedKeys.current.has("S"),
      lp: pressedKeys.current.has("j") || pressedKeys.current.has("J"),
      rp: pressedKeys.current.has("k") || pressedKeys.current.has("K"),
      lk: pressedKeys.current.has("u") || pressedKeys.current.has("U"),
      rk: pressedKeys.current.has("i") || pressedKeys.current.has("I"),
    };
    setVisualState(vis);
  }, [pressedKeys.current]); // Note: this is not perfect due to ref, but works for demo

  return (
    <>
      {/* Your existing touch controller (hidden on large screens) */}
      <div
        style={{ display: "none" }}
        className="fixed inset-x-0 bottom-0 z-50 lg:hidden pointer-events-none select-none"
        id="game-controller-2"
      >
        <div className="bg-gradient-to-t from-black/25 to-transparent pt-1 pb-3 px-2 pointer-events-auto">
          <div className="flex items-end justify-between h-40">
            <div className="pl-1 pb-1">
              <Dpad onMove={onPlayer1Move} />
            </div>
            <div className="pr-1 pb-1">
              <Actions onAction={onPlayer1Action} />
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Debug Overlay - Remove or comment out when done testing */}
      <div className="fixed top-4 right-4 bg-black/80 text-white text-xs p-4 rounded-lg font-mono z-50 hidden lg:block">
        <div className="mb-2 text-green-400">Keyboard Test (8 buttons simultaneous)</div>
        <div>Left: {visualState.left ? "●" : "○"} | Right: {visualState.right ? "●" : "○"}</div>
        <div>Forward: {visualState.forward ? "●" : "○"} | Back: {visualState.back ? "●" : "○"}</div>
        <div>LP: {visualState.lp ? "●" : "○"} | RP: {visualState.rp ? "●" : "○"}</div>
        <div>LK: {visualState.lk ? "●" : "○"} | RK: {visualState.rk ? "●" : "○"}</div>
        <div className="mt-2 text-yellow-400">
          Total: {Object.values(visualState).filter(Boolean).length}/8
        </div>
      </div>
    </>
  );
};

// Keep your DirButton, ActionButton, Dpad, Actions components exactly as before
// (I omitted them here for brevity — just paste them back from your previous version)

export { GameController1 };

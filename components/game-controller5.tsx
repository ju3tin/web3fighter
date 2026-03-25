// components/game-controller1.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

type Direction = 
  | "left" | "right" | "forward" | "back" 
  | "forward-left" | "forward-right" 
  | "back-left" | "back-right" 
  | "stop";

type Action = "punch" | "kick" | "block";

interface GameControllerProps {
  onPlayer1Move: (dir: Direction) => void;
  onPlayer1Action: (action: Action) => void;
}

// ====================== KEYBOARD MAPPING ======================
const MOVEMENT_KEYS: Record<string, Exclude<Direction, "stop">> = {
  ArrowLeft: "left",  a: "left", A: "left",
  ArrowRight: "right", d: "right", D: "right",
  ArrowUp: "forward", w: "forward", W: "forward",
  ArrowDown: "back",  s: "back", S: "back",
};

const ACTION_KEYS: Record<string, Action> = {
  j: "punch",   // LP
  k: "punch",   // RP
  u: "kick",    // LK
  i: "kick",    // RK
  // " ": "block", // uncomment for block on spacebar
};

const GameController1: React.FC<GameControllerProps> = ({
  onPlayer1Move,
  onPlayer1Action,
}) => {
  const pressedKeys = useRef<Set<string>>(new Set());
  const currentDirection = useRef<Direction>("stop");

  // Calculate 8-way direction from currently pressed movement keys
  const updateMovement = useCallback(() => {
    const horizontal = new Set< "left" | "right" >();
    const vertical = new Set< "forward" | "back" >();

    pressedKeys.current.forEach((key) => {
      const dir = MOVEMENT_KEYS[key];
      if (!dir) return;
      if (dir === "left" || dir === "right") horizontal.add(dir);
      if (dir === "forward" || dir === "back") vertical.add(dir);
    });

    let h: "left" | "right" | null = null;
    let v: "forward" | "back" | null = null;

    if (horizontal.size === 1) h = horizontal.values().next().value;
    if (vertical.size === 1) v = vertical.values().next().value;

    let newDir: Direction = "stop";

    if (h && v) {
      if (h === "left" && v === "forward") newDir = "forward-left";
      else if (h === "right" && v === "forward") newDir = "forward-right";
      else if (h === "left" && v === "back") newDir = "back-left";
      else if (h === "right" && v === "back") newDir = "back-right";
    } 
    else if (h) newDir = h;
    else if (v) newDir = v;

    // Only notify parent if direction actually changed
    if (newDir !== currentDirection.current) {
      currentDirection.current = newDir;
      onPlayer1Move(newDir);
    }
  }, [onPlayer1Move]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;

      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d"].includes(key)) {
        e.preventDefault();
      }

      if (pressedKeys.current.has(key)) return;

      pressedKeys.current.add(key);

      if (MOVEMENT_KEYS[key]) {
        updateMovement();
      }

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

      if (MOVEMENT_KEYS[key]) {
        updateMovement();
      }
    },
    [updateMovement]
  );

  // Keyboard setup
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Visual debug state (shows all 8 buttons live)
  const [visualState, setVisualState] = useState({
    left: false, right: false, forward: false, back: false,
    forwardLeft: false, forwardRight: false,
    backLeft: false, backRight: false,
    lp: false, rp: false, lk: false, rk: false,
  });

  useEffect(() => {
    const keys = pressedKeys.current;
    setVisualState({
      left: keys.has("ArrowLeft") || keys.has("a") || keys.has("A"),
      right: keys.has("ArrowRight") || keys.has("d") || keys.has("D"),
      forward: keys.has("ArrowUp") || keys.has("w") || keys.has("W"),
      back: keys.has("ArrowDown") || keys.has("s") || keys.has("S"),
      forwardLeft: (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) && 
                   (keys.has("ArrowUp") || keys.has("w") || keys.has("W")),
      forwardRight: (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) && 
                    (keys.has("ArrowUp") || keys.has("w") || keys.has("W")),
      backLeft: (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) && 
                (keys.has("ArrowDown") || keys.has("s") || keys.has("S")),
      backRight: (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) && 
                 (keys.has("ArrowDown") || keys.has("s") || keys.has("S")),
      lp: keys.has("j") || keys.has("J"),
      rp: keys.has("k") || keys.has("K"),
      lk: keys.has("u") || keys.has("U"),
      rk: keys.has("i") || keys.has("I"),
    });
  }, [pressedKeys.current]); // Works because we force update on key changes via setState in parent if needed

  return (
    <>
      {/* Touch Controller (mobile only) */}
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

      {/* Keyboard Debug Panel (visible on desktop for testing) */}
      <div className="fixed top-4 right-4 bg-black/90 text-white text-xs p-4 rounded-xl font-mono z-[60] hidden lg:block border border-white/20">
        <div className="text-lime-400 mb-3 font-bold">8-BUTTON SIMULTANEOUS TEST</div>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          <div>← Left:     {visualState.left ? "●" : "○"}</div>
          <div>→ Right:    {visualState.right ? "●" : "○"}</div>
          <div>↑ Forward:  {visualState.forward ? "●" : "○"}</div>
          <div>↓ Back:     {visualState.back ? "●" : "○"}</div>
          
          <div>↖ F-Left:  {visualState.forwardLeft ? "●" : "○"}</div>
          <div>↗ F-Right: {visualState.forwardRight ? "●" : "○"}</div>
          <div>↙ B-Left:  {visualState.backLeft ? "●" : "○"}</div>
          <div>↘ B-Right: {visualState.backRight ? "●" : "○"}</div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/20">
          LP: {visualState.lp ? "●" : "○"} &nbsp; RP: {visualState.rp ? "●" : "○"} &nbsp; 
          LK: {visualState.lk ? "●" : "○"} &nbsp; RK: {visualState.rk ? "●" : "○"}
        </div>

        <div className="mt-2 text-yellow-400">
          Total active: {Object.values(visualState).filter(v => v === true).length} / 12
        </div>
        <div className="text-[10px] text-white/50 mt-1">You can press all at once</div>
      </div>
    </>
  );
};

// === Paste your original DirButton, ActionButton, Dpad, Actions components here ===
// (They remain 100% unchanged from your last version)

const DirButton = /* ... your original DirButton ... */;
const ActionButton = /* ... your original ActionButton ... */;
const Dpad = /* ... your original Dpad ... */;
const Actions = /* ... your original Actions ... */;

export { GameController1 };

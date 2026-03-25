// components/game-controller5.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

type Direction =
  | "left"
  | "right"
  | "forward"
  | "back"
  | "forward-left"
  | "forward-right"
  | "back-left"
  | "back-right"
  | "stop";

type Action = "punch" | "kick" | "block";

interface GameControllerProps {
  onPlayer1Move: (dir: Direction) => void;
  onPlayer1Action: (action: Action) => void;
}

// ====================== KEYBOARD MAPPING ======================
const MOVEMENT_KEYS: Record<string, Exclude<Direction, "stop">> = {
  ArrowLeft: "left", a: "left", A: "left",
  ArrowRight: "right", d: "right", D: "right",
  ArrowUp: "forward", w: "forward", W: "forward",
  ArrowDown: "back", s: "back", S: "back",
};

const ACTION_KEYS: Record<string, Action> = {
  j: "punch",   // LP
  k: "punch",   // RP
  u: "kick",    // LK
  i: "kick",    // RK
};

const GameController1: React.FC<GameControllerProps> = ({
  onPlayer1Move,
  onPlayer1Action,
}) => {
  const pressedKeys = useRef<Set<string>>(new Set());
  const currentDirection = useRef<Direction>("stop");

  const updateMovement = useCallback(() => {
    const horizontal = new Set<"left" | "right">();
    const vertical = new Set<"forward" | "back">();

    pressedKeys.current.forEach((key) => {
      const dir = MOVEMENT_KEYS[key];
      if (!dir) return;
      if (dir === "left" || dir === "right") horizontal.add(dir);
      if (dir === "forward" || dir === "back") vertical.add(dir);
    });

    let h: "left" | "right" | null = null;
    let v: "forward" | "back" | null = null;
    if (horizontal.size === 1) h = [...horizontal][0];
    if (vertical.size === 1) v = [...vertical][0];

    let newDir: Direction = "stop";
    if (h && v) {
      if (h === "left" && v === "forward") newDir = "forward-left";
      else if (h === "right" && v === "forward") newDir = "forward-right";
      else if (h === "left" && v === "back") newDir = "back-left";
      else if (h === "right" && v === "back") newDir = "back-right";
    } else if (h) newDir = h;
    else if (v) newDir = v;

    if (newDir !== currentDirection.current) {
      currentDirection.current = newDir;
      onPlayer1Move(newDir);
    }
  }, [onPlayer1Move]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(key)) {
      e.preventDefault();
    }
    if (pressedKeys.current.has(key)) return;

    pressedKeys.current.add(key);

    if (MOVEMENT_KEYS[key]) updateMovement();
    const action = ACTION_KEYS[key];
    if (action) onPlayer1Action(action);
  }, [updateMovement, onPlayer1Action]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key;
    if (!pressedKeys.current.has(key)) return;
    pressedKeys.current.delete(key);
    if (MOVEMENT_KEYS[key]) updateMovement();
  }, [updateMovement]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // ====================== TOUCH D-PAD WITH DIAGONALS ======================
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>, onMove: (dir: Direction) => void) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((touch.clientY - rect.top) / rect.height - 0.5) * 2;

    let dir: Direction = "stop";

    const deadzone = 0.3;

    if (Math.abs(x) < deadzone && Math.abs(y) < deadzone) {
      dir = "stop";
    } else if (Math.abs(x) > Math.abs(y)) {
      // Horizontal dominant
      dir = x < 0 ? "left" : "right";
    } else {
      // Vertical dominant
      dir = y < 0 ? "forward" : "back";
    }

    // Diagonal detection
    if (Math.abs(x) > deadzone && Math.abs(y) > deadzone) {
      if (x < 0 && y < 0) dir = "forward-left";
      else if (x > 0 && y < 0) dir = "forward-right";
      else if (x < 0 && y > 0) dir = "back-left";
      else if (x > 0 && y > 0) dir = "back-right";
    }

    onMove(dir);
  }, []);

  const Dpad = ({ onMove }: { onMove: (d: Direction) => void }) => {
    const [currentDir, setCurrentDir] = useState<Direction>("stop");

    const handleStart = (dir: Direction) => {
      setCurrentDir(dir);
      onMove(dir);
    };

    const handleEnd = () => {
      setCurrentDir("stop");
      onMove("stop");
    };

    return (
      <div
        className="relative w-32 h-32 touch-none"
        onTouchMove={(e) => {
          e.preventDefault();
          handleTouchMove(e, (dir) => {
            setCurrentDir(dir);
            onMove(dir);
          });
        }}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
      >
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-white/10 border border-white/30" />

        {/* Visual indicators for 8 directions */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${currentDir.includes("forward") && currentDir.includes("left") ? "opacity-100" : "opacity-30"}`}>↖</div>
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${currentDir.includes("forward") && currentDir.includes("right") ? "opacity-100" : "opacity-30"}`}>↗</div>
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${currentDir.includes("back") && currentDir.includes("left") ? "opacity-100" : "opacity-30"}`}>↙</div>
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${currentDir.includes("back") && currentDir.includes("right") ? "opacity-100" : "opacity-30"}`}>↘</div>

        <div className={`absolute left-1/2 top-3 -translate-x-1/2 text-2xl transition-opacity ${currentDir === "forward" ? "opacity-100" : "opacity-40"}`}>↑</div>
        <div className={`absolute left-1/2 bottom-3 -translate-x-1/2 text-2xl transition-opacity ${currentDir === "back" ? "opacity-100" : "opacity-40"}`}>↓</div>
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-2xl transition-opacity ${currentDir === "left" ? "opacity-100" : "opacity-40"}`}>←</div>
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-2xl transition-opacity ${currentDir === "right" ? "opacity-100" : "opacity-40"}`}>→</div>
      </div>
    );
  };

  // Keep your original Action buttons
  const ActionButton: React.FC<{
    action: Action;
    label: string;
    color: "amber" | "red" | "gray";
    onAction: (a: Action) => void;
  }> = ({ action, label, color, onAction }) => {
    const handleStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onAction(action);
      if ("vibrate" in navigator) navigator.vibrate(action === "block" ? 15 : 35);
    }, [action, onAction]);

    const base = "w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-sm transition-all touch-none active:scale-95";
    const colors = {
      amber: "bg-amber-600/25 border-amber-400/50 text-amber-100 active:bg-amber-600/40",
      red: "bg-red-600/25 border-red-400/50 text-red-100 active:bg-red-600/40",
      gray: "bg-gray-600/25 border-gray-400/50 text-gray-200 active:bg-gray-600/40",
    }[color];

    return (
      <div className={`${base} ${colors}`} onTouchStart={handleStart} style={{ touchAction: "none" }}>
        {label}
      </div>
    );
  };

  const Actions = ({ onAction }: { onAction: (a: Action) => void }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="grid grid-cols-2 gap-1.5">
        <ActionButton action="punch" label="LP" color="amber" onAction={onAction} />
        <ActionButton action="punch" label="RP" color="amber" onAction={onAction} />
        <ActionButton action="kick" label="LK" color="red" onAction={onAction} />
        <ActionButton action="kick" label="RK" color="red" onAction={onAction} />
      </div>
    </div>
  );

  return (
    <>
      {/* Touch Controller - Mobile only */}
      <div
        style={{ display: "none" }}
        className="fixed inset-x-0 bottom-0 z-50 lg:hidden pointer-events-none select-none"
        id="game-controller-2"
      >
        <div className="bg-gradient-to-t from-black/25 to-transparent pt-1 pb-3 px-2 pointer-events-auto">
          <div className="flex items-end justify-between h-44">
            <div className="pl-2 pb-2">
              <Dpad onMove={onPlayer1Move} />
            </div>
            <div className="pr-2 pb-2">
              <Actions onAction={onPlayer1Action} />
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Debug (desktop only) */}
      <div className="fixed top-4 right-4 bg-black/90 text-white text-xs p-4 rounded-xl font-mono z-[60] hidden lg:block border border-white/20">
        <div className="text-lime-400 mb-2 font-bold">8-WAY + ACTIONS TEST</div>
        <div>Keyboard + Touch D-Pad both support diagonals now</div>
      </div>
    </>
  );
};

export { GameController1 };

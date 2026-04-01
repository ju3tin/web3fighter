// components/game-controller1.tsx
"use client";

import SettingsMenu from '@/components/SettingsMenu';
import ControllerSVG from "@/components/controller.svg";
import Pad2 from "@/components/pad2.svg"
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

// ====================== GAMEPAD MAPPING (Standard Layout) ======================
const GAMEPAD_MOVEMENT_THRESHOLD = 0.5;
const GAMEPAD_DEADZONE = 0.2;

const GameController1: React.FC<GameControllerProps> = ({
  onPlayer1Move,
  onPlayer1Action,
}) => {
  const keysPressed = useRef<Set<string>>(new Set());
  const currentDir = useRef<Direction>("stop");
  const gamepadIndex = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // ====================== KEYBOARD ======================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["w", "a", "s", "d", "j", "k", "l", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        e.preventDefault();
      }
      if (keysPressed.current.has(key)) return;
      keysPressed.current.add(key);

      // Movement (WASD)
      if (key === "a") onPlayer1Move("left");
      if (key === "d") onPlayer1Move("right");
      if (key === "w") onPlayer1Move("forward");
      if (key === "s") onPlayer1Move("back");

      // Actions
      if (key === "j") onPlayer1Action("punch");
      if (key === "k") onPlayer1Action("kick");
      if (key === "l") onPlayer1Action("block");
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.delete(key);

      // Simple fallback for movement (stops if no other WASD pressed)
      const stillMoving = ["a", "d", "w", "s"].some((k) => keysPressed.current.has(k));
      if (!stillMoving) {
        onPlayer1Move("stop");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onPlayer1Move, onPlayer1Action]);

  // ====================== GAMEPAD ======================
  const updateGamepad = useCallback(() => {
    if (gamepadIndex.current === null) return;

    const gamepads = navigator.getGamepads();
    const gp = gamepads[gamepadIndex.current];
    if (!gp) return;

    // --- Movement: Left Stick (axes[0] = X, axes[1] = Y) ---
    const stickX = gp.axes[0] ?? 0;
    const stickY = gp.axes[1] ?? 0;

    let newDir: Direction = "stop";

    const absX = Math.abs(stickX);
    const absY = Math.abs(stickY);

    if (absX > GAMEPAD_DEADZONE || absY > GAMEPAD_DEADZONE) {
      if (absX > absY) {
        newDir = stickX < 0 ? "left" : "right";
      } else {
        newDir = stickY < 0 ? "forward" : "back";
      }

      // Diagonal override
      if (absX > GAMEPAD_MOVEMENT_THRESHOLD && absY > GAMEPAD_MOVEMENT_THRESHOLD) {
        if (stickX < 0 && stickY < 0) newDir = "forward-left";
        else if (stickX > 0 && stickY < 0) newDir = "forward-right";
        else if (stickX < 0 && stickY > 0) newDir = "back-left";
        else if (stickX > 0 && stickY > 0) newDir = "back-right";
      }
    }

    if (newDir !== currentDir.current) {
      currentDir.current = newDir;
      onPlayer1Move(newDir);
    }

    // --- Actions: Face Buttons (standard mapping) ---
    // 0 = A (punch), 1 = B (kick), 2 = X (block) — change as you like
    if (gp.buttons[0]?.pressed) onPlayer1Action("punch");
    if (gp.buttons[1]?.pressed) onPlayer1Action("kick");
    if (gp.buttons[2]?.pressed) onPlayer1Action("block");

    rafRef.current = requestAnimationFrame(updateGamepad);
  }, [onPlayer1Move, onPlayer1Action]);

  useEffect(() => {
    const onGamepadConnected = (e: GamepadEvent) => {
      console.log("Gamepad connected:", e.gamepad.id);
      if (gamepadIndex.current === null) {
        gamepadIndex.current = e.gamepad.index;
        rafRef.current = requestAnimationFrame(updateGamepad);
      }
    };

    const onGamepadDisconnected = (e: GamepadEvent) => {
      if (e.gamepad.index === gamepadIndex.current) {
        console.log("Gamepad disconnected");
        gamepadIndex.current = null;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        onPlayer1Move("stop");
      }
    };

    window.addEventListener("gamepadconnected", onGamepadConnected);
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected);

    // Auto-connect if a gamepad is already plugged in
    const initialGamepads = navigator.getGamepads();
    for (let i = 0; i < initialGamepads.length; i++) {
      if (initialGamepads[i]) {
        gamepadIndex.current = i;
        rafRef.current = requestAnimationFrame(updateGamepad);
        break;
      }
    }

    return () => {
      window.removeEventListener("gamepadconnected", onGamepadConnected);
      window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateGamepad, onPlayer1Move]);

  // ====================== TOUCH D-PAD (8 directions) ======================
  const Dpad = ({ onMove }: { onMove: (d: Direction) => void }) => {
    const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      const x = ((touch.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((touch.clientY - rect.top) / rect.height - 0.5) * 2;

      let dir: Direction = "stop";
      const dead = 0.25;

      if (Math.abs(x) > dead || Math.abs(y) > dead) {
        if (Math.abs(x) > Math.abs(y) * 1.2) {
          dir = x < 0 ? "left" : "right";
        } else if (Math.abs(y) > Math.abs(x) * 1.2) {
          dir = y < 0 ? "forward" : "back";
        } else {
          // diagonal
          if (x < 0 && y < 0) dir = "forward-left";
          else if (x > 0 && y < 0) dir = "forward-right";
          else if (x < 0 && y > 0) dir = "back-left";
          else dir = "back-right";
        }
      }
      onMove(dir);
    };

    return (
      <div
        className="relative w-32 h-32 touch-none"
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        onTouchEnd={() => onMove("stop")}
        onTouchCancel={() => onMove("stop")}
      >
        <div className="absolute inset-0 rounded-full bg-white/10 border border-white/30" />
        <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">⬡</div>
      </div>
    );
  };

  // ====================== ACTION BUTTONS ======================
  const ActionButton: React.FC<{
    action: Action;
    label: string;
    color: "amber" | "red" | "gray";
    onAction: (a: Action) => void;
  }> = ({ action, label, color, onAction }) => {
    const handleStart = (e: React.TouchEvent) => {
      e.preventDefault();
      onAction(action);
      if ("vibrate" in navigator) navigator.vibrate(action === "block" ? 15 : 35);
    };

    const base = "w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-sm transition-all active:scale-95 touch-none";
    const colors = {
      amber: "bg-amber-600/25 border-amber-400/50 text-amber-100 active:bg-amber-600/40",
      red: "bg-red-600/25 border-red-400/50 text-red-100 active:bg-red-600/40",
      gray: "bg-gray-600/25 border-gray-400/50 text-gray-200 active:bg-gray-600/40",
    }[color];

    return (
      <div className={`${base} ${colors}`} onTouchStart={handleStart}>
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
     <SettingsMenu />
    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden pointer-events-none select-none">
      <div className="bg-gradient-to-t from-black/25 to-transparent pt-1 pb-3 px-2 pointer-events-auto">
        <div className="flex items-end justify-between h-44">
          <div className="pl-2 pb-2">
          <svg
   id="svg2"
   viewBox="0 0 78 77.999998"
   version="1.0"
   width="78"
   height="78">
  <circle
  id="path3221"
  style={{
    display: 'inline',
    fill: '#333333',
    fillRule: 'evenodd',
    stroke: '#000000',
    strokeWidth: 0.999952,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }}
  transform="scale(-1,1)"
  cx={-38.9613}
  cy={38.72736}
  r={37.906826}
/>
  <path
  id="path3219"
  display="inline"
  fill="#262626"
  fillRule="evenodd"
  strokeWidth={1.2761}
  d="m 29.01968,3.00011 c -1.95255,0 -3.54777,1.59504 -3.54777,3.54736 V 25.25403 H 6.72489 c -1.95254,0 -3.50948,1.59503 -3.50948,3.54736 v 19.89326 c 0,1.96509 1.55694,3.56012 3.50948,3.56012 h 18.74702 v 18.6938 c 0,1.96508 1.59522,3.54736 3.54777,3.54736 h 19.90833 c 1.95255,0 3.50948,-1.58228 3.50948,-3.54736 v -18.6938 h 18.73426 c 1.96531,0 3.50948,-1.59503 3.50948,-3.56012 V 28.80139 c 0,-1.95233 -1.54417,-3.54736 -3.50948,-3.54736 H 52.43749 V 6.54747 c 0,-1.95232 -1.55693,-3.54736 -3.50948,-3.54736 z"
/>
<ellipse
  id="path3246"
  fill="#5a5a5a"
  fillRule="evenodd"
  stroke="#454545"
  strokeWidth={1.39429}
  strokeLinecap="round"
  strokeLinejoin="round"
  cx={38.953426}
  cy={63.910221}
  rx={11.309089}
  ry={11.6584}
/>
<ellipse
  id="path3244-1"
  display="inline"
  fill="#5a5a5a"
  fillRule="evenodd"
  stroke="#454545"
  strokeWidth={1.39429}
  strokeLinecap="round"
  strokeLinejoin="round"
  cx={38.953232}
  cy={13.760545}
  rx={11.309089}
  ry={11.6584}
/><ellipse
  id="path3250"
  fill="#5a5a5a"
  fillRule="evenodd"
  stroke="#454545"
  strokeWidth={1.39429}
  strokeLinecap="round"
  strokeLinejoin="round"
  transform="scale(-1)"
  cx={-14.636654}
  cy={-38.868961}
  rx={11.309089}
  ry={11.6584}
/><ellipse
  id="path3248-7"
  fill="#5a5a5a"
  fillRule="evenodd"
  stroke="#454545"
  strokeWidth={1.39429}
  strokeLinecap="round"
  strokeLinejoin="round"
  transform="scale(-1)"
  cx={-62.995564}
  cy={-38.626194}
  rx={11.309089}
  ry={11.6584}
/>
<path
  id="path3309"
  fill="none"
  stroke="#00ff83"
  strokeWidth={1.1416}
  transform="matrix(1.2038977,0,0,1.2390022,-501.97409,-623.49444)"
  d="m 455.30029,518.14036 -11.97417,0 5.98708,-10.36993 z"
/><rect
  id="rect3307"
  fill="none"
  stroke="#ff01db"
  strokeWidth={1.39429}
  rx={0}
  ry={0}
  height={13.347011}
  width={12.947104}
  y={32.162693}
  x={8.1595421}
/>

<ellipse
  id="path3311"
  fill="none"
  stroke="#ff0000"
  strokeWidth={2.0333}
  strokeLinecap="round"
  strokeLinejoin="round"
  transform="scale(-1)"
  cx={-63.275723}
  cy={-38.834965}
  rx={7.754981}
  ry={7.9945145}
/>

<path
  id="path3313"
  fill="none"
  stroke="#8243fb"
  strokeWidth={1.39429}
  d="m 33.22124,58.11182 11.67259,12.03315 m 0,-12.03315 -11.67259,12.03315"
/>
</svg>
            <Dpad onMove={onPlayer1Move} />
          </div>
          <div className="pr-2 pb-2">
           
            <Actions onAction={onPlayer1Action} />
          </div>
        </div>
      </div>
    </div>
      </>
  );
};

export { GameController1 };

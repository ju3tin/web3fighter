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
   height="78"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:dc="http://purl.org/dc/elements/1.1/">
  <defs
     id="defs1" />
  <circle
     id="path2416"
     style="display:inline;fill:#333333;fill-rule:evenodd;stroke:#000000;stroke-width:0.999952;stroke-linecap:round;stroke-linejoin:round"
     cx="39.139889"
     cy="39.095585"
     r="37.906826" />
  <path
     id="rect3214"
     style="display:inline;fill:#262626;fill-rule:evenodd"
     d="m 31.18946,10.62125 c -1.53,0 -2.78,1.25 -2.78,2.78 v 14.66 h -14.68 c -1.54,0 -2.76,1.24 -2.76,2.78 v 15.59 c 0,1.54 1.22,2.78 2.76,2.78 h 14.68 v 14.66 c 0,1.54 1.25,2.78 2.78,2.78 h 15.6 c 1.53,0 2.75,-1.24 2.75,-2.78 v -14.66 h 14.69 c 1.53,0 2.74,-1.24 2.74,-2.78 v -15.59 c 0,-1.54 -1.21,-2.78 -2.74,-2.78 h -14.69 v -14.66 c 0,-1.53 -1.22,-2.78 -2.75,-2.78 z" />
  <path
     style="fill:#28170b;stroke-width:1.50491"
     id="path1"
     d="M 73.508215,49.055538 A 24.385,22.507402 0 0 1 66.296986,65.034134 24.385,22.507402 0 0 1 48.928364,71.562222 L 49.123215,49.055538 Z" />
  <path
     style="fill:#28170b;stroke-width:1.5856"
     id="path1-0"
     d="M 73.477182,-27.824688 A 25.208963,24.168493 0 0 1 66.022287,-10.66684 25.208963,24.168493 0 0 1 48.066785,-3.6569663 L 48.268219,-27.824688 Z"
     transform="scale(1,-1)" />
  <path
     style="fill:#28170b;stroke-width:1.58558"
     id="path1-0-9"
     d="m -3.0522785,-28.267262 a 25.208963,24.168493 0 0 1 -7.4548955,17.157849 25.208963,24.168493 0 0 1 -17.955502,7.0098732 l 0.201434,-24.1677222 z"
     transform="scale(-1)" />
  <path
     style="fill:#28170b;stroke-width:1.47927"
     id="path1-0-9-9"
     d="m -4.5426235,51.161034 a 23.561041,22.507401 0 0 1 -6.9675645,15.978594 23.561041,22.507401 0 0 1 -16.781743,6.528088 l 0.188267,-22.506682 z"
     transform="scale(-1,1)" />
  <path
     style="fill:#818181;fill-opacity:1;stroke-width:0.540859"
     d="m 17.29796,14.27199 -0.19543,6.19542 1.75881,-1.807 2.93133,5.16285 1.95423,-2.58142 -3.32218,-4.90471 0.78169,-1.807 z"
     id="path2" />
  <path
     style="fill:#818181;fill-opacity:1;stroke-width:0.540859"
     d="m 14.76425,64.22909 -0.19543,-6.19542 1.75881,1.807 2.93133,-5.16285 1.95423,2.58142 -3.32218,4.90471 0.78169,1.807 z"
     id="path2-7" />
  <path
     style="fill:#818181;fill-opacity:1;stroke-width:0.540859"
     d="m 62.70957,13.44414 -5.82898,2.10819 2.3291,0.96642 -3.71389,4.63193 3.12091,0.86179 3.32957,-4.8997 1.96796,0.0585 z"
     id="path2-0" />
  <path
     style="fill:#818181;fill-opacity:1;stroke-width:0.540859"
     d="m 59.83494,64.84032 -5.82898,-2.10819 2.3291,-0.96642 -3.71389,-4.63193 3.12091,-0.86179 3.32957,4.8997 1.96796,-0.0585 z"
     id="path2-0-0" />
  <path
     id="path3332"
     style="fill:#5a5a5a;fill-rule:evenodd;stroke:#454545;stroke-linecap:round;stroke-linejoin:round"
     d="m 318.71094,523.29102 a 1.1789336,1.1789336 0 0 0 -0.94922,0.44726 l -3.5,4.4375 a 1.1789336,1.1789336 0 0 0 -0.002,1.45703 l 3.5,4.46875 a 1.1789336,1.1789336 0 0 0 0.92382,0.45313 l 8.125,0.0312 a 1.1789336,1.1789336 0 0 0 1.1836,-1.17969 V 524.625 a 1.1789336,1.1789336 0 0 0 -1.15625,-1.17773 z"
     transform="matrix(0,1.9345296,-1.6970837,0,936.55342,-559.6654)" />
  <path
     id="path3324"
     style="fill:#5a5a5a;fill-rule:evenodd;stroke:#454545;stroke-linecap:round;stroke-linejoin:round"
     d="m 318.71094,523.29102 a 1.1789336,1.1789336 0 0 0 -0.94922,0.44726 l -3.5,4.4375 a 1.1789336,1.1789336 0 0 0 -0.002,1.45703 l 3.5,4.46875 a 1.1789336,1.1789336 0 0 0 0.92382,0.45313 l 8.125,0.0312 a 1.1789336,1.1789336 0 0 0 1.1836,-1.17969 V 524.625 a 1.1789336,1.1789336 0 0 0 -1.15625,-1.17773 z"
     transform="matrix(-1.8987829,0,0,1.9257072,627.13202,-980.02567)" />
  <path
     id="path3322"
     style="fill:#5a5a5a;fill-rule:evenodd;stroke:#454545;stroke-linecap:round;stroke-linejoin:round"
     d="m 318.71094,523.29102 a 1.1789336,1.1789336 0 0 0 -0.94922,0.44726 l -3.5,4.4375 a 1.1789336,1.1789336 0 0 0 -0.002,1.45703 l 3.5,4.46875 a 1.1789336,1.1789336 0 0 0 0.92382,0.45313 l 8.125,0.0312 a 1.1789336,1.1789336 0 0 0 1.1836,-1.17969 V 524.625 a 1.1789336,1.1789336 0 0 0 -1.15625,-1.17773 z"
     transform="matrix(1.9564857,0,0,1.9232778,-567.28915,-978.56879)" />
  <path
     id="path3334"
     style="fill:#5a5a5a;fill-rule:evenodd;stroke:#454545;stroke-linecap:round;stroke-linejoin:round"
     d="m 318.71094,523.29102 a 1.1789336,1.1789336 0 0 0 -0.94922,0.44726 l -3.5,4.4375 a 1.1789336,1.1789336 0 0 0 -0.002,1.45703 l 3.5,4.46875 a 1.1789336,1.1789336 0 0 0 0.92382,0.45313 l 8.125,0.0312 a 1.1789336,1.1789336 0 0 0 1.1836,-1.17969 V 524.625 a 1.1789336,1.1789336 0 0 0 -1.15625,-1.17773 z"
     transform="matrix(0,-1.9345296,-1.6970837,0,936.70613,636.9379)" />
  <path
     id="path3273"
     style="display:inline;fill:#3f3f3f;fill-rule:evenodd"
     transform="matrix(0,-0.41947689,-0.7642593,0,432.20831,120.97083)"
     d="m 279.9716,514.41351 -12.66533,7.31233 v -14.62466 z" />
  <path
     id="path3303-7"
     style="display:inline;fill:#3f3f3f;fill-rule:evenodd"
     d="m 279.9716,514.41351 -12.66533,7.31233 v -14.62466 z"
     transform="matrix(-0.41910851,0,0,-0.76493107,122.31744,431.15123)" />
  <path
     id="path3303"
     style="display:inline;fill:#3f3f3f;fill-rule:evenodd"
     d="m 279.9716,514.41351 -12.66533,7.31233 v -14.62466 z"
     transform="matrix(0.41910851,0,0,-0.76493107,-43.070805,432.07794)" />
  <path
     id="path3295"
     style="display:inline;fill:#3f3f3f;fill-rule:evenodd"
     d="m 279.9716,514.41351 -12.66533,7.31233 v -14.62466 z"
     transform="matrix(0,0.41947689,-0.7642593,0,432.20831,-43.80352)" />
</svg>

            <Dpad onMove={onPlayer1Move} />
          </div>
          <div className="pr-2 pb-2">
            <Pad2 />
            <Actions onAction={onPlayer1Action} />
          </div>
        </div>
      </div>
    </div>
      </>
  );
};

export { GameController1 };

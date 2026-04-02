// components/game-controller1.tsx
"use client";

import SettingsMenu from '@/components/SettingsMenu';
import ControllerSVG from "@/components/controller.svg";
import Pad2 from "@/components/pad2.svg"
import Pad1b from "@/components/Pad1b"
import Pad1a from "@/components/Pad1a"
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

/** LP/RP = left/right punch, LK/RK = left/right kick */
export type Player1Action = "lp" | "rp" | "lk" | "rk" | "block";
type Action = Player1Action;

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
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "j",
          "k",
          "u",
          "i",
          "l",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
        ].includes(key)
      ) {
        e.preventDefault();
      }
      if (keysPressed.current.has(key)) return;
      keysPressed.current.add(key);

      // Movement (WASD)
      if (key === "a") onPlayer1Move("left");
      if (key === "d") onPlayer1Move("right");
      if (key === "w") onPlayer1Move("forward");
      if (key === "s") onPlayer1Move("back");

      // Actions: j/k = punches, u/i = kicks, l = block
      if (key === "j") onPlayer1Action("lp");
      if (key === "k") onPlayer1Action("rp");
      if (key === "u") onPlayer1Action("lk");
      if (key === "i") onPlayer1Action("rk");
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

    // --- Actions: face buttons + LB (Xbox-style indices) ---
    if (gp.buttons[0]?.pressed) onPlayer1Action("lp");
    if (gp.buttons[1]?.pressed) onPlayer1Action("rp");
    if (gp.buttons[2]?.pressed) onPlayer1Action("lk");
    if (gp.buttons[3]?.pressed) onPlayer1Action("rk");
    if (gp.buttons[4]?.pressed) onPlayer1Action("block");

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
        <ActionButton action="lp" label="LP" color="amber" onAction={onAction} />
        <ActionButton action="rp" label="RP" color="amber" onAction={onAction} />
        <ActionButton action="lk" label="LK" color="red" onAction={onAction} />
        <ActionButton action="rk" label="RK" color="red" onAction={onAction} />
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
         <Pad1b />

            {/* <Dpad onMove={onPlayer1Move} /> */}
          </div>
          <div className="pr-2 pb-2">

        <Pad1a
          handleDown={(action) => {
            console.log("pressed action", action);
            if (
              action === "lp" ||
              action === "rp" ||
              action === "lk" ||
              action === "rk" ||
              action === "block"
            ) {
              onPlayer1Action(action);
            }
          }}
          handleUp={() => {}}
        />

            {/* <Actions onAction={onPlayer1Action} /> */}
          </div>
        </div>
      </div>
    </div>
      </>
  );
};

export { GameController1 };

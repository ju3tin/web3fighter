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
          <svg xmlns="http://www.w3.org/2000/svg" width={128} height={128}>
    <circle
      cx={-64.245}
      cy={64.011}
      r={62.862}
      style={{
        display: "inline",
        fill: "#333",
        fillRule: "evenodd",
        stroke: "#000",
        strokeWidth: 1.65824,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
      transform="scale(-1 1)"
    />
    <path
      d="M47.759 4.764c-3.238 0-5.884 2.645-5.884 5.883v31.021H10.787c-3.238 0-5.82 2.645-5.82 5.883v32.99c0 3.258 2.582 5.903 5.82 5.903h31.088v31a5.884 5.884 0 0 0 5.884 5.883h33.014c3.238 0 5.82-2.624 5.82-5.883v-31h31.067c3.26 0 5.82-2.645 5.82-5.904V47.55c0-3.237-2.56-5.882-5.82-5.882H86.593V10.647c0-3.238-2.582-5.883-5.82-5.883z"
      style={{
        display: "inline",
        fill: "#262626",
        fillRule: "evenodd",
        strokeWidth: 2.11618,
      }}
    />
    <ellipse
      cx={64.232}
      cy={105.772}
      rx={18.754}
      ry={19.333}
      style={{
        fill: "#5a5a5a",
        fillRule: "evenodd",
        stroke: "#454545",
        strokeWidth: 2.31218,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
    />
    <ellipse
      cx={64.232}
      cy={22.608}
      rx={18.754}
      ry={19.333}
      style={{
        display: "inline",
        fill: "#5a5a5a",
        fillRule: "evenodd",
        stroke: "#454545",
        strokeWidth: 2.31218,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
    />
    <ellipse
      cx={-23.907}
      cy={-64.246}
      rx={18.754}
      ry={19.333}
      style={{
        fill: "#5a5a5a",
        fillRule: "evenodd",
        stroke: "#454545",
        strokeWidth: 2.31218,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
      transform="scale(-1)"
    />
    <ellipse
      cx={-104.102}
      cy={-63.843}
      rx={18.754}
      ry={19.333}
      style={{
        fill: "#5a5a5a",
        fillRule: "evenodd",
        stroke: "#454545",
        strokeWidth: 2.31218,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
      transform="scale(-1)"
    />
    <path
      d="M76.184 30.439H52.28L64.23 9.132Z"
      style={{
        fill: "none",
        stroke: "#00ff83",
        strokeWidth: 2.31213,
      }}
    />
    <rect
      width={21.47}
      height={22.134}
      x={13.166}
      y={53.125}
      rx={0}
      ry={0}
      style={{
        fill: "none",
        stroke: "#ff01db",
        strokeWidth: 2.31218,
      }}
    />
    <ellipse
      cx={-104.566}
      cy={-64.19}
      rx={12.86}
      ry={13.257}
      style={{
        fill: "none",
        stroke: "red",
        strokeWidth: 3.37186,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
      transform="scale(-1)"
    />
    <path
      d="m54.726 96.157 19.357 19.955m0-19.955-19.357 19.955"
      style={{
        fill: "none",
        stroke: "#8243fb",
        strokeWidth: 2.31218,
      }}
    />
  </svg>

            <Dpad onMove={onPlayer1Move} />
          </div>
          <div className="pr-2 pb-2">

          <svg xmlns="http://www.w3.org/2000/svg" width={128} height={128}>
    <circle
      cx={63.763}
      cy={63.718}
      r={62.209}
      style={{
        display: "inline",
        fill: "#333",
        fillRule: "evenodd",
        stroke: "#000",
        strokeWidth: 1.64103,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
    />
    <path
      d="M50.715 16.989a4.574 4.574 0 0 0-4.562 4.562V45.61H22.062c-2.528 0-4.53 2.035-4.53 4.562v25.585c0 2.527 2.002 4.562 4.53 4.562h24.091v24.059a4.563 4.563 0 0 0 4.562 4.562h25.602c2.51 0 4.513-2.035 4.513-4.562V80.319h24.107c2.511 0 4.497-2.035 4.497-4.562V50.172c0-2.527-1.986-4.562-4.497-4.562H80.83V21.55c0-2.51-2.003-4.562-4.513-4.562z"
      style={{
        display: "inline",
        fill: "#262626",
        fillRule: "evenodd",
        strokeWidth: 1.64111,
      }}
    />
    <path
      d="M120.165 80.064a40.018 36.937 0 0 1-11.835 26.222A40.018 36.937 0 0 1 79.827 117l.32-36.936Z"
      style={{
        fill: "#28170b",
        strokeWidth: 2.46972,
      }}
    />
    <path
      d="M120.114 45.222a41.37 39.663 0 0 0-12.234-28.158A41.37 39.663 0 0 0 78.413 5.56l.33 39.662Z"
      style={{
        fill: "#28170b",
        strokeWidth: 2.60214,
      }}
    />
    <path
      d="M4.54 45.948A41.37 39.663 0 0 1 16.772 17.79 41.37 39.663 0 0 1 46.24 6.286l-.33 39.662z"
      style={{
        fill: "#28170b",
        strokeWidth: 2.60211,
      }}
    />
    <path
      d="M6.985 83.52a38.666 36.937 0 0 0 11.434 26.222 38.666 36.937 0 0 0 27.541 10.713l-.309-36.936Z"
      style={{
        fill: "#28170b",
        strokeWidth: 2.42764,
      }}
    />
    <path
      d="m27.918 22.98-.32 10.168 2.885-2.966 4.811 8.473 3.207-4.236-5.452-8.05 1.283-2.965ZM23.76 104.965l-.321-10.167 2.886 2.965 4.811-8.472 3.207 4.236-5.452 8.05 1.283 2.965zM102.443 21.622l-9.566 3.46 3.822 1.585-6.094 7.602 5.121 1.414 5.465-8.04 3.23.095zM97.726 105.968l-9.566-3.46 3.822-1.585-6.095-7.602 5.122-1.414 5.464 8.04 3.23-.095z"
      style={{
        fill: "#818181",
        fillOpacity: 1,
        strokeWidth: 0.887608,
      }}
    />
    <path
      d="M79.099 92.922a3.283 3.743 0 0 0-1.246-3.014L65.494 78.796a3.283 3.743 0 0 0-4.058-.006L48.99 89.902a3.283 3.743 0 0 0-1.262 2.933l-.087 25.795a3.283 3.743 0 0 0 3.286 3.757h24.456a3.283 3.743 0 0 0 3.28-3.67z"
      style={{
        fill: "#5a5a5a",
        fillRule: "evenodd",
        stroke: "#454545",
        strokeWidth: 2.97356,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
    />
    <path
      d="M35.584 44.984a3.674 3.726 0 0 1 2.958 1.413l10.906 14.024a3.674 3.726 0 0 1 .006 4.605L38.548 79.148a3.674 3.726 0 0 1-2.879 1.432l-25.318.099a3.674 3.726 0 0 1-3.688-3.728V49.199a3.674 3.726 0 0 1 3.603-3.722z"
      style={{
        fill: "#5a5a5a",
        fillRule: "evenodd",
        stroke: "#454545",
        strokeWidth: 3.13813,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
    />
    <path
      d="M91.866 45.288a3.785 3.721 0 0 0-3.048 1.412L77.58 60.706a3.785 3.721 0 0 0-.006 4.599L88.812 79.41a3.785 3.721 0 0 0 2.966 1.43l26.088.098a3.785 3.721 0 0 0 3.8-3.723V49.499a3.785 3.721 0 0 0-3.713-3.718z"
      style={{
        fill: "#5a5a5a",
        fillRule: "evenodd",
        stroke: "#454545",
        strokeWidth: 3.18344,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
    />
    <path
      d="M79.35 33.008a3.283 3.743 0 0 1-1.246 3.013l-12.36 11.112a3.283 3.743 0 0 1-4.057.006L49.24 36.028a3.283 3.743 0 0 1-1.262-2.933L47.892 7.3a3.283 3.743 0 0 1 3.286-3.758h24.456a3.283 3.743 0 0 1 3.28 3.67z"
      style={{
        fill: "#5a5a5a",
        fillRule: "evenodd",
        stroke: "#454545",
        strokeWidth: 2.97356,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
    />
    <path
      d="m63.637 5.35-9.172 8.72h18.343zM7.701 61.363l8.711-9.18v18.36ZM121.411 62.884l-8.711-9.18v18.36zM63.637 120.406l-9.172-8.718h18.343z"
      style={{
        display: "inline",
        fill: "#3f3f3f",
        fillRule: "evenodd",
        strokeWidth: 0.929205,
      }}
    />
  </svg>

            <Actions onAction={onPlayer1Action} />
          </div>
        </div>
      </div>
    </div>
      </>
  );
};

export { GameController1 };

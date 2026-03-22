// components/game-controller1.tsx
"use client";

import React, { useCallback, useEffect, useRef } from "react";

type Direction = "left" | "right" | "forward" | "back" | "stop";
type Action = "punch" | "kick" | "block";

interface GameControllerProps {
  onPlayer1Move: (dir: Direction) => void;
  onPlayer1Action: (action: Action) => void;
}

const DirButton: React.FC<{
  dir: Exclude<Direction, "stop">;
  onMove: (d: Direction) => void;
}> = ({ dir, onMove }) => {
  const handleStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onMove(dir);
    if ("vibrate" in navigator) navigator.vibrate(20);

    const end = () => onMove("stop");
    document.addEventListener("touchend", end, { once: true, passive: false });
    document.addEventListener("touchcancel", end, { once: true, passive: false });
  }, [dir, onMove]);

  const style: React.CSSProperties = {
    touchAction: "none",
  };

  if (dir === "left")    Object.assign(style, { left: 0,    top: "50%", transform: "translateY(-50%)" });
  if (dir === "right")   Object.assign(style, { right: 0,   top: "50%", transform: "translateY(-50%)" });
  if (dir === "forward") Object.assign(style, { left: "50%", top: 0,   transform: "translateX(-50%)" });
  if (dir === "back")    Object.assign(style, { left: "50%", bottom: 0,      transform: "translateX(-50%)" });

  return (
    <div
      className="absolute w-14 h-14 flex items-center justify-center text-xl font-black text-white/90 rounded-full bg-white/15 border border-white/30 active:bg-white/35 active:scale-95 transition-all touch-none shadow-sm"
      style={style}
      onTouchStart={handleStart}
    >
      {dir === "left" ? "←" : dir === "right" ? "→" : dir === "forward" ? "↑" : "↓"}
    </div>
  );
};

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
    red:   "bg-red-600/25 border-red-400/50 text-red-100 active:bg-red-600/40",
    gray:  "bg-gray-600/25 border-gray-400/50 text-gray-200 active:bg-gray-600/40",
  }[color];

  return (
    <div className={`${base} ${colors}`} onTouchStart={handleStart} style={{ touchAction: "none" }}>
      {label}
    </div>
  );
};

const Dpad = ({ onMove }: { onMove: (d: Direction) => void }) => (
  <div className="relative w-28 h-28">
    <div className="absolute inset-0 rounded-full bg-white/8" />
    <DirButton dir="left"    onMove={onMove} />
    <DirButton dir="right"   onMove={onMove} />
    <DirButton dir="back" onMove={onMove} />  {/* ↑ = forward */}
    <DirButton dir="forward"    onMove={onMove} />  {/* ↓ = forward */}
  </div>
);

const Actions = ({ onAction }: { onAction: (a: Action) => void }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="grid grid-cols-2 gap-1.5">
      <ActionButton action="punch" label="LP" color="amber" onAction={onAction} />
      <ActionButton action="punch" label="RP" color="amber" onAction={onAction} />
      <ActionButton action="kick" label="LK" color="red"   onAction={onAction} />
      <ActionButton action="kick" label="RK" color="red"   onAction={onAction} />
    </div>
 {/*   <ActionButton action="block" label="BLK" color="gray" onAction={onAction} /> */}
  </div>
);

export const GameController1: React.FC<GameControllerProps> = ({
  onPlayer1Move,
  onPlayer1Action,
}) => {

  const keysPressed = useRef<Set<string>>(new Set())
  const p1Move = useRef<"left" | "right" | "forward" | "back" | "stop">("stop")
  const p2Move = useRef<"left" | "right" | "forward" | "back" | "stop">("stop")
  useEffect(() => {
    const p1MoveKeyToDir: Record<string, "left" | "right" | "forward" | "back"> = {
      a: "left",
      d: "right",
      w: "forward",
      s: "back",
    }

    const p2MoveKeyToDir: Record<string, "left" | "right" | "forward" | "back"> = {
      arrowleft: "left",
      arrowright: "right",
      arrowup: "forward",
      arrowdown: "back",
    }

    const computeFallbackMove = (
      mapping: Record<string, "left" | "right" | "forward" | "back">,
    ): "left" | "right" | "forward" | "back" | "stop" => {
      // Priority order when the "active" key is released.
      // (We don’t have key order history, so we pick a stable priority.)
      const priority = Object.keys(mapping)
      for (const k of priority) {
        if (keysPressed.current.has(k)) return mapping[k]
      }
      return "stop"
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()

      // Prevent default for game keys
      if (
        ["w", "a", "s", "d", "j", "k", "l", "arrowup", "arrowdown", "arrowleft", "arrowright", "1", "2", "3"].includes(
          key,
        )
      ) {
        e.preventDefault()
      }

      if (keysPressed.current.has(key)) return
      keysPressed.current.add(key)

      // Player 1 Controls (WASD + JKL)
      if (key in p1MoveKeyToDir) {
        const dir = p1MoveKeyToDir[key]
        p1Move.current = dir
        onPlayer1Move(dir)
        window.dispatchEvent(new Event("Player 1-walk"))
      }
      if (key === "j") {
        onPlayer1Action("punch")
        window.dispatchEvent(new Event("Player 1-punch"))
      }
      if (key === "k") {
        onPlayer1Action("kick")
        window.dispatchEvent(new Event("Player 1-kick"))
      }
      if (key === "l") {
        onPlayer1Action("block")
        window.dispatchEvent(new Event("Player 1-block"))
      }

      // Player 2 Controls (Arrow Keys + 123)
    
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keysPressed.current.delete(key)

      // Player 1 stop moving
      if (key in p1MoveKeyToDir) {
        const releasedDir = p1MoveKeyToDir[key]
        if (p1Move.current === releasedDir) {
          const next = computeFallbackMove(p1MoveKeyToDir)
          p1Move.current = next
          onPlayer1Move(next)
          window.dispatchEvent(new Event(next === "stop" ? "Player 1-idle" : "Player 1-walk"))
        }
      }

      // Player 1 stop blocking
      if (key === "l") {
        window.dispatchEvent(new Event("Player 1-idle"))
      }

      // Player 2 stop moving
   

      // Player 2 stop blocking
   
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [onPlayer1Move, onPlayer1Action, p1Move, p2Move])

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden pointer-events-none select-none">
      <div className="bg-gradient-to-t from-black/25 to-transparent pt-1 pb-3 px-2 pointer-events-auto">
        <div className="flex items-end justify-between h-40">
          {/* Left – D-pad */}
          <div className="pl-1 pb-1">
            <Dpad onMove={onPlayer1Move} />
          </div>

          {/* Right – Actions */}
          <div className="pr-1 pb-1">
            <Actions onAction={onPlayer1Action} />
          </div>
        </div>
      </div>
    </div>
  );
};
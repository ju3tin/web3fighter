// @/components/game-controller1.tsx - FIXED: Short, transparent, + BLOCK button
"use client";

import React, { useCallback, useEffect } from "react";

type Direction = "left" | "right" | "forward" | "back" | "stop";
type Action = "punch" | "kick" | "block";

interface GameControllerProps {
  onPlayer1Move: (dir: Direction) => void;
  onPlayer1Action: (action: Action) => void;  // 👈 Added "block"
}

const dirIcon: Record<Exclude<Direction, "stop">, string> = {
  left: "←", right: "→", forward: "↑", back: "↓",
};

const getDirStyle = (dir: Exclude<Direction, "stop">): React.CSSProperties => ({
  left: { left: "12px", top: "50%", transform: "translateY(-50%)" },
  right: { right: "12px", top: "50%", transform: "translateY(-50%)" },
  forward: { left: "50%", bottom: "40px", transform: "translateX(-50%)" },
  back: { left: "50%", top: "40px", transform: "translateX(-50%)" },
}[dir] || {});

const DirButton: React.FC<{ dir: Exclude<Direction, "stop">; onMove: (d: Direction) => void }> = ({ dir, onMove }) => {
  const handleStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); onMove(dir);
    if ("vibrate" in navigator) navigator.vibrate(30);
    const end = () => onMove("stop");
    document.addEventListener("touchend", end, { once: true, passive: false });
    document.addEventListener("touchcancel", end, { once: true, passive: false });
  }, [dir, onMove]);

  return (
    <div
      className="absolute w-20 h-20 flex items-center justify-center text-2xl font-black text-white drop-shadow-2xl rounded-full bg-white/30 border-3 border-white/50 active:bg-white/60 active:scale-95 transition-all duration-150 touch-none select-none shadow-xl hover:brightness-110"
      style={{ ...getDirStyle(dir), touchAction: "none" }}
      onTouchStart={handleStart}
    >
      {dirIcon[dir]}
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
    e.preventDefault(); e.stopPropagation(); onAction(action);
    if ("vibrate" in navigator) navigator.vibrate(action === "block" ? 20 : 50);
  }, [action, onAction]);

  const base = "w-18 h-18 rounded-full flex items-center justify-center text-sm font-black drop-shadow-2xl border-3 active:scale-95 transition-all duration-150 touch-none select-none shadow-xl hover:brightness-110";
  const colors = {
    amber: "bg-amber-400/40 border-amber-400/70 text-amber-900 active:bg-amber-400/70",
    red: "bg-red-500/40 border-red-400/70 text-red-900 active:bg-red-500/70",
    gray: "bg-gray-500/40 border-gray-400/70 text-gray-100 active:bg-gray-500/70"
  }[color] || "";

  return (
    <div className={`${base} ${colors}`} onTouchStart={handleStart} style={{ touchAction: "none" }}>
      {label}
    </div>
  );
};

const Dpad = ({ onMove }: { onMove: (d: Direction) => void }) => (
  <div className="relative w-44 h-44 flex items-center justify-center">
    <div className="w-16 h-16 bg-white/20 rounded-full absolute" />
    <DirButton dir="left" onMove={onMove} />
    <DirButton dir="right" onMove={onMove} />
    <DirButton dir="forward" onMove={onMove} />
    <DirButton dir="back" onMove={onMove} />
  </div>
);

const Actions = ({ onAction }: { onAction: (a: Action) => void }) => (
  <div className="flex flex-col items-center gap-4 p-2">
    <div className="grid grid-cols-2 gap-3">
      <ActionButton action="punch" label="LP" color="amber" onAction={onAction} />
      <ActionButton action="punch" label="RP" color="amber" onAction={onAction} />
      <ActionButton action="kick" label="LK" color="red" onAction={onAction} />
      <ActionButton action="kick" label="RK" color="red" onAction={onAction} />
    </div>
    {/* 👈 NEW BLOCK BUTTON */}
    <ActionButton action="block" label="BLOCK" color="gray" onAction={onAction} />
  </div>
);

const PlayerControls = ({ onMove, onAction }: { onMove: (d: Direction) => void; onAction: (a: Action) => void }) => (
  <div className="w-full max-w-3xl h-64 flex items-end justify-between gap-8 px-4 sm:px-8">  {/* 👈 h-64 (shorter!) */}
    <div className="flex-1 h-4/5 flex items-center justify-center max-w-[200px]">
      <Dpad onMove={onMove} />
    </div>
    <div className="flex-1 h-4/5 flex items-center justify-center max-w-[200px]">
      <Actions onAction={onAction} />
    </div>
  </div>
);

export const GameController1: React.FC<GameControllerProps> = ({ onPlayer1Move, onPlayer1Action }) => {
  useEffect(() => {
    const keys: Record<string, () => void> = {
      a: () => onPlayer1Move("left"), d: () => onPlayer1Move("right"),
      w: () => onPlayer1Move("forward"), s: () => onPlayer1Move("back"),
      q: () => onPlayer1Action("punch"), e: () => onPlayer1Action("kick"),
      // 👈 NEW: Space/B for block
      " ": () => onPlayer1Action("block"), b: () => onPlayer1Action("block"),
    };
    const handleKeyDown = (e: KeyboardEvent) => keys[e.key.toLowerCase()]?.();
    const handleKeyUp = (e: KeyboardEvent) => {
      if (["a", "d", "w", "s"].includes(e.key.toLowerCase())) onPlayer1Move("stop");
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onPlayer1Move, onPlayer1Action]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden select-none pointer-events-none">  {/* 👈 pointer-events-none on wrapper */}
      <div className="bg-gradient-to-t from-black/60 via-black/20 to-transparent backdrop-blur-sm pt-4 pb-4 sm:pt-6 sm:pb-6 px-2 sm:px-4 pointer-events-auto">  {/* 👈 LESS FOGGY / SHORTER */}
        <PlayerControls onMove={onPlayer1Move} onAction={onPlayer1Action} />
      </div>
    </div>
  );
};
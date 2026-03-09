// @/components/game-controller1.tsx - COMPACT MOBILE VERSION
"use client";

import React, { useCallback, useEffect } from "react";

type Direction = "left" | "right" | "forward" | "back" | "stop";
type Action = "punch" | "kick" | "block";

interface GameControllerProps {
  onPlayer1Move: (dir: Direction) => void;
  onPlayer1Action: (action: Action) => void;
}

const dirIcon: Record<Exclude<Direction, "stop">, string> = {
  left: "←", right: "→", forward: "↑", back: "↓",
};

const DirButton: React.FC<{ dir: Exclude<Direction, "stop">; onMove: (d: Direction) => void }> = ({ dir, onMove }) => {
  const handleStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); e.stopPropagation(); onMove(dir);
    if ("vibrate" in navigator) navigator.vibrate(20);
    const end = () => onMove("stop");
    document.addEventListener("touchend", end, { once: true, passive: false });
    document.addEventListener("touchcancel", end, { once: true, passive: false });
  }, [dir, onMove]);

  return (
    <div
      className="absolute w-16 h-16 flex items-center justify-center text-xl font-black text-white/90 rounded-full bg-white/20 border border-white/40 active:bg-white/40 active:scale-90 transition-all touch-none shadow-md"
      style={{
        ...(dir === "left" ? { left: "8px", top: "50%", transform: "translateY(-50%)" } : {}),
        ...(dir === "right" ? { right: "8px", top: "50%", transform: "translateY(-50%)" } : {}),
        ...(dir === "forward" ? { left: "50%", bottom: "32px", transform: "translateX(-50%)" } : {}),
        ...(dir === "back" ? { left: "50%", top: "32px", transform: "translateX(-50%)" } : {}),
        touchAction: "none",
      }}
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
  const handleStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); e.stopPropagation(); onAction(action);
    if ("vibrate" in navigator) navigator.vibrate(action === "block" ? 15 : 35);
  }, [action, onAction]);

  const sizes = "w-14 h-14 text-xs font-bold";
  const colors = {
    amber: "bg-amber-500/30 border-amber-400/60 text-amber-100 active:bg-amber-500/50",
    red: "bg-red-600/30 border-red-400/60 text-red-100 active:bg-red-600/50",
    gray: "bg-gray-600/30 border-gray-400/60 text-gray-200 active:bg-gray-600/50",
  }[color];

  return (
    <div
      className={`flex items-center justify-center rounded-full border-2 shadow-md transition-all touch-none ${sizes} ${colors}`}
      onTouchStart={handleStart}
      style={{ touchAction: "none" }}
    >
      {label}
    </div>
  );
};

const Dpad = ({ onMove }: { onMove: (d: Direction) => void }) => (
  <div className="relative w-36 h-36">
    <div className="absolute inset-0 rounded-full bg-white/10" />
    <DirButton dir="left" onMove={onMove} />
    <DirButton dir="right" onMove={onMove} />
    <DirButton dir="forward" onMove={onMove} />
    <DirButton dir="back" onMove={onMove} />
  </div>
);

const Actions = ({ onAction }: { onAction: (a: Action) => void }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="grid grid-cols-2 gap-2.5">
      <ActionButton action="punch" label="LP" color="amber" onAction={onAction} />
      <ActionButton action="punch" label="RP" color="amber" onAction={onAction} />
      <ActionButton action="kick" label="LK" color="red" onAction={onAction} />
      <ActionButton action="kick" label="RK" color="red" onAction={onAction} />
    </div>
    <ActionButton action="block" label="BLOCK" color="gray" onAction={onAction} />
  </div>
);

export const GameController1: React.FC<GameControllerProps> = ({ onPlayer1Move, onPlayer1Action }) => {
  // Keyboard support remains the same...

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden pointer-events-none select-none">
      {/* Very minimal container – almost no fog */}
      <div className="bg-gradient-to-t from-black/35 to-transparent pt-2 pb-3 px-3 pointer-events-auto">
        <div className="flex items-end justify-between max-w-md mx-auto gap-6">
          <Dpad onMove={onPlayer1Move} />
          <Actions onAction={onPlayer1Action} />
        </div>
      </div>
    </div>
  );
};
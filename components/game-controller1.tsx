// @/components/game-controller.tsx - UPDATED FOR SINGLE-PLAYER MOBILE
"use client";

import React, { useCallback, useEffect } from "react";

type Direction = "left" | "right" | "forward" | "back" | "stop";

interface GameControllerProps {
  onPlayer1Move: (dir: Direction) => void;
  onPlayer1Action: (action: "punch" | "kick") => void;
}

const dirIcon: Record<Exclude<Direction, "stop">, string> = {
  left: "←",
  right: "→",
  forward: "↑",
  back: "↓",
};

const getDirStyle = (dir: Exclude<Direction, "stop">): React.CSSProperties => {
  switch (dir) {
    case "left":
      return { left: "12px", top: "50%", transform: "translateY(-50%)" };
    case "right":
      return { right: "12px", top: "50%", transform: "translateY(-50%)" };
    case "forward":
      return { left: "50%", bottom: "40px", transform: "translateX(-50%)" };
    case "back":
      return { left: "50%", top: "40px", transform: "translateX(-50%)" };
    default:
      return {};
  }
};

const DirButton: React.FC<{
  dir: Exclude<Direction, "stop">;
  onMove: (d: Direction) => void;
}> = ({ dir, onMove }) => {
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onMove(dir);
      if ("vibrate" in navigator) navigator.vibrate(30);

      const handleTouchEnd = () => {
        onMove("stop");
      };

      document.addEventListener("touchend", handleTouchEnd, { once: true, passive: false });
      document.addEventListener("touchcancel", handleTouchEnd, { once: true, passive: false });
    },
    [dir, onMove]
  );

  return (
    <div
      className="absolute w-24 h-24 flex items-center justify-center text-3xl font-black text-white drop-shadow-2xl rounded-full bg-white/40 border-4 border-white/60 active:bg-white/70 active:scale-95 transition-all duration-200 touch-none select-none shadow-2xl hover:brightness-110"
      style={{
        ...getDirStyle(dir),
        touchAction: "none",
      }}
      onTouchStart={handleTouchStart}
    >
      {dirIcon[dir]}
    </div>
  );
};

const ActionButton: React.FC<{
  action: "punch" | "kick";
  label: string;
  color: "amber" | "red";
  onAction: (a: "punch" | "kick") => void;
}> = ({ action, label, color, onAction }) => {
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onAction(action);
      if ("vibrate" in navigator) navigator.vibrate(50);
    },
    [action, onAction]
  );

  const baseClass =
    "w-20 h-20 rounded-full flex items-center justify-center text-base font-black drop-shadow-2xl border-4 active:scale-95 transition-all duration-200 touch-none select-none shadow-2xl hover:brightness-110";
  const colorClass =
    color === "amber"
      ? "bg-amber-400/50 border-amber-500 text-amber-900 active:bg-amber-500/80"
      : "bg-red-500/50 border-red-400 text-red-100 active:bg-red-600/80";

  return (
    <div
      className={`${baseClass} ${colorClass}`}
      onTouchStart={handleTouchStart}
      style={{ touchAction: "none" }}
    >
      {label}
    </div>
  );
};

const Dpad: React.FC<{ onMove: (d: Direction) => void }> = ({ onMove }) => (
  <div className="relative w-52 h-52 flex items-center justify-center">
    <div className="w-20 h-20 bg-white/30 rounded-full absolute" />
    <DirButton dir="left" onMove={onMove} />
    <DirButton dir="right" onMove={onMove} />
    <DirButton dir="forward" onMove={onMove} />
    <DirButton dir="back" onMove={onMove} />
  </div>
);

const Actions: React.FC<{ onAction: (a: "punch" | "kick") => void }> = ({
  onAction,
}) => (
  <div className="grid grid-cols-2 gap-8 w-52 h-52 p-4 box-border">
    <ActionButton action="punch" label="LP" color="amber" onAction={onAction} />
    <ActionButton action="punch" label="RP" color="amber" onAction={onAction} />
    <ActionButton action="kick" label="LK" color="red" onAction={onAction} />
    <ActionButton action="kick" label="RK" color="red" onAction={onAction} />
  </div>
);

const PlayerControls: React.FC<{
  onMove: (d: Direction) => void;
  onAction: (a: "punch" | "kick") => void;
}> = ({ onMove, onAction }) => (
  <div className="w-full max-w-4xl h-80 flex items-center justify-between gap-12 px-8">
    <div className="flex-1 h-full flex items-center justify-center max-w-[260px]">
      <Dpad onMove={onMove} />
    </div>
    <div className="flex-1 h-full flex items-center justify-center max-w-[260px]">
      <Actions onAction={onAction} />
    </div>
  </div>
);

export const GameController1: React.FC<GameControllerProps> = ({
  onPlayer1Move,
  onPlayer1Action,
}) => {
  // Optional: Keyboard fallback for desktop testing
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "a": return onPlayer1Move("left");
        case "d": return onPlayer1Move("right");
        case "w": return onPlayer1Move("forward");
        case "s": return onPlayer1Move("back");
        case "q": case "1": return onPlayer1Action("punch");
        case "e": case "2": return onPlayer1Action("kick");
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (["a","d","w","s"].includes(e.key.toLowerCase())) {
        onPlayer1Move("stop");
      }
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onPlayer1Move, onPlayer1Action]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-md pt-12 pb-12 px-4 lg:hidden select-none">
      <PlayerControls
        onMove={onPlayer1Move}
        onAction={onPlayer1Action}
      />
    </div>
  );
};
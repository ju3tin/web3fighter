"use client";

import { Canvas } from "@react-three/fiber";
import { useState, useCallback, useEffect, useRef } from "react";
import { GameScene } from "@/components/game-scene";
import { GameUI } from "@/components/game-ui";
import { GameController1, type Player1Action } from "@/components/game-controller5c";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

/* ---------------- TYPES ---------------- */

type GameState = "playing" | "paused" | "round-end" | "game-over";

type Character = {
  id: string;
  model: string;
  animelist: string[];           // Fixed: should be array, not string
  moveslist?: Array<string>;
};

type Direction = "left" | "right" | "forward" | "back" | null;

type Props = {
  selectedId?: string;
};

/* ---------------- COMPONENT ---------------- */

export default function TekkenGame({ selectedId }: Props) {
  const searchParams = useSearchParams();
  const p1 = searchParams?.get("p1") ?? "ken";

  const [character, setCharacter] = useState<Character | null>(null);
  const [gameState, setGameState] = useState<GameState>("playing");

  /* ---------------- PLAYER STATE ---------------- */
  const [player1Position, setPlayer1Position] = useState<[number, number, number]>([-2, 0, 0]);
  const [player2Position, setPlayer2Position] = useState<[number, number, number]>([2, 0, 0]);

  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const [currentRound, setCurrentRound] = useState(1);
  const [gameTime, setGameTime] = useState(99);
  const [winner, setWinner] = useState<string | null>(null);

  /* ---------------- MOVEMENT DIRECTION ---------------- */
  const [p1Dir, setP1Dir] = useState<Direction>(null);
  const [p2Dir, setP2Dir] = useState<Direction>(null);

  /* ---------------- REFS (to avoid stale closures) ---------------- */
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const getLookAtRotation = (from: [number, number, number], to: [number, number, number]) => {
    const dx = to[0] - from[0];
    const dz = to[2] - from[2];
    const angle = Math.atan2(dx, dz);
    return [0, angle, 0] as [number, number, number];
  };

  /* ---------------- CHARACTER LOAD ---------------- */
  useEffect(() => {
    async function fetchCharacter() {
      try {
        const res = await fetch("/api/chartactermovelist");
        if (!res.ok) throw new Error("Failed to fetch characters");
        
        const data: Character[] = await res.json();
        const result = data.find((item) => item.id === (selectedId ?? p1));
        setCharacter(result ?? null);
      } catch (error) {
        console.error("Failed to load character:", error);
      }
    }

    fetchCharacter();
  }, [p1, selectedId]);

  /* ---------------- MOVEMENT LOOP ---------------- */
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      if (p1Dir) movePlayer(setPlayer1Position, p1Dir);
      if (p2Dir) movePlayer(setPlayer2Position, p2Dir);
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, [p1Dir, p2Dir, gameState]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setGameTime((prev) => {
        if (prev <= 1) {
          const roundWinner = player1Health > player2Health ? "Player 1" : "Player 2";
          endRound(roundWinner);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, player1Health, player2Health]);

  /* ---------------- KO CHECK ---------------- */
  useEffect(() => {
    if (gameState !== "playing") return;

    if (player1Health <= 0) endRound("Player 2");
    if (player2Health <= 0) endRound("Player 1");
  }, [player1Health, player2Health, gameState]);

  /* ---------------- GAME FLOW ---------------- */
  const startGame = () => {
    setGameState("playing");
    setPlayer1Health(100);
    setPlayer2Health(100);
    setGameTime(99);
    setPlayer1Position([-2, 0, 0]);
    setPlayer2Position([2, 0, 0]);
    setCurrentRound(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setWinner(null);
    setP1Dir(null);
    setP2Dir(null);
  };

  const endRound = (roundWinner: string) => {
    const newP1Score = roundWinner === "Player 1" ? player1Score + 1 : player1Score;
    const newP2Score = roundWinner === "Player 2" ? player2Score + 1 : player2Score;

    setPlayer1Score(newP1Score);
    setPlayer2Score(newP2Score);

    if (newP1Score >= 2) {
      setWinner("Player 1");
      setGameState("game-over");
    } else if (newP2Score >= 2) {
      setWinner("Player 2");
      setGameState("game-over");
    } else {
      setWinner(roundWinner);
      setGameState("round-end");
    }

    setP1Dir(null);
    setP2Dir(null);
  };

  const nextRound = () => {
    setCurrentRound((r) => r + 1);
    setPlayer1Health(100);
    setPlayer2Health(100);
    setGameTime(99);
    setPlayer1Position([-2, 0, 0]);
    setPlayer2Position([2, 0, 0]);
    setWinner(null);
    setGameState("playing");
    setP1Dir(null);
    setP2Dir(null);
  };

  /* ---------------- MOVEMENT LOGIC ---------------- */
  const movePlayer = (
    setter: React.Dispatch<React.SetStateAction<[number, number, number]>>,
    direction: Exclude<Direction, null>
  ) => {
    const speed = 0.1;

    setter(([x, y, z]) => {
      switch (direction) {
        case "left":
          return [Math.max(x - speed, -4.5), y, z];
        case "right":
          return [Math.min(x + speed, 4.5), y, z];
        case "forward":
          return [x, y, Math.max(z - speed, -2.5)];
        case "back":
          return [x, y, Math.min(z + speed, 2.5)];
        default:
          return [x, y, z];
      }
    });
  };

  /* ---------------- ATTACKS ---------------- */
  const performAttack = useCallback(
    (
      attackerPos: [number, number, number],
      defenderPos: [number, number, number],
      damageSetter: React.Dispatch<React.SetStateAction<number>>,
      hitEvent: string,
      action: Player1Action
    ) => {
      if (gameStateRef.current !== "playing" || action === "block") return;

      const distance = Math.hypot(
        attackerPos[0] - defenderPos[0],
        attackerPos[2] - defenderPos[2]
      );

      if (distance < 1.5) {
        const damage = action === "lp" || action === "rp" ? 5 : 8;
        damageSetter((hp) => Math.max(hp - damage, 0));
        window.dispatchEvent(new Event(hitEvent));
      }
    },
    []
  );

  const handlePlayer1Action = useCallback(
    (action: Player1Action) => {
      performAttack(player1Position, player2Position, setPlayer2Health, "Player2-hit", action);
    },
    [player1Position, player2Position, performAttack]
  );

  const handlePlayer2Action = useCallback(
    (action: Player1Action) => {
      performAttack(player2Position, player1Position, setPlayer1Health, "Player1-hit", action);
    },
    [player2Position, player1Position, performAttack]
  );

  /* ---------------- RENDER ---------------- */
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ powerPreference: "high-performance" }}
        camera={{ position: [0, 2, 8], fov: 50 }}
      >
        {character && (
          <GameScene
            p1={p1}
            model={character.model}
            animelist={character.animelist}
            player1Rotation={getLookAtRotation(player1Position, player2Position)}
            player2Rotation={getLookAtRotation(player2Position, player1Position)}
          />
        )}
      </Canvas>

      {/* GAME HUD */}
      {gameState === "playing" && (
        <>
          <GameUI
            player1Health={player1Health}
            player2Health={player2Health}
            gameTime={gameTime}
            currentRound={currentRound}
            player1Score={player1Score}
            player2Score={player2Score}
          />

          <GameController1
            onPlayer1Move={(d) => setP1Dir(d === "stop" ? null : d)}
            onPlayer1Action={handlePlayer1Action}
          />
        </>
      )}

      {/* ROUND END SCREEN */}
      {gameState === "round-end" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white z-50">
          <h1 className="text-5xl font-bold mb-6">
            ROUND {currentRound} — {winner} WINS!
          </h1>
          <div className="text-2xl mb-10">
            Score: {player1Score} – {player2Score}
          </div>
          <Button size="lg" className="text-xl px-10 py-6" onClick={nextRound}>
            NEXT ROUND →
          </Button>
        </div>
      )}

      {/* GAME OVER SCREEN */}
      {gameState === "game-over" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-50">
          <h1 className="text-6xl font-bold mb-4 text-yellow-400">GAME OVER</h1>
          <h2 className="text-4xl mb-8">
            WINNER: <span className="text-green-400">{winner}</span>
          </h2>
          <div className="text-2xl mb-12">
            Final Score: {player1Score} – {player2Score}
          </div>
          <Button
            size="lg"
            variant="outline"
            className="text-xl px-10 py-6"
            onClick={startGame}
          >
            PLAY AGAIN
          </Button>
        </div>
      )}

      {/* Optional Start / Paused Screen */}
      {gameState === "paused" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
          <Button size="lg" onClick={startGame}>
            Start Game
          </Button>
        </div>
      )}
    </div>
  );
}
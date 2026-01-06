"use client";

import { Canvas } from "@react-three/fiber";
import { useState, useCallback, useEffect } from "react";
import { GameScene } from "@/components/game-scene";
import { GameUI } from "@/components/game-ui";
import { GameController } from "@/components/game-controller";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

type GameState = "playing" | "paused" | "round-end" | "game-over";

export default function TekkenGame({ selectedId }) {
  const searchParams = useSearchParams();
  const p1 = searchParams.get("p1") ?? "jin"; // fallback character if no ?p1=
  const [character, setCharacter] = useState(null);

  const [gameState, setGameState] = useState<GameState>("playing");
  const [player1Position, setPlayer1Position] = useState<[number, number, number]>([-2, 0, 0]);
  const [player2Position, setPlayer2Position] = useState<[number, number, number]>([2, 0, 0]);
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameTime, setGameTime] = useState(99);
  const [winner, setWinner] = useState<string | null>(null);


  useEffect(() => {
    async function fetchCharacter() {
      const res = await fetch("/api/characters");
      const data = await res.json();

      const result = data.find(item => item.id === p1);
      setCharacter(result);
    }

    fetchCharacter();
    
  }, [selectedId]);
  // Timer countdown
useEffect(() => {
  if (character) {
    console.log(character.model, "this is the model 1");
  }
}, [character]);

  
  
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

  // Knockout detection
  useEffect(() => {
    if (gameState !== "playing") return;

    if (player1Health <= 0) endRound("Player 2");
    else if (player2Health <= 0) endRound("Player 1");
  }, [player1Health, player2Health, gameState]);

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
  };

  const endRound = (roundWinner: string) => {
    if (roundWinner === "Player 1") {
      setPlayer1Score((prev) => prev + 1);
    } else {
      setPlayer2Score((prev) => prev + 1);
    }

    const newP1Score = roundWinner === "Player 1" ? player1Score + 1 : player1Score;
    const newP2Score = roundWinner === "Player 2" ? player2Score + 1 : player2Score;

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
  };

  const nextRound = () => {
    setCurrentRound((prev) => prev + 1);
    setPlayer1Health(100);
    setPlayer2Health(100);
    setGameTime(99);
    setPlayer1Position([-2, 0, 0]);
    setPlayer2Position([2, 0, 0]);
    setWinner(null);
    setGameState("playing");
  };

  const handlePlayer1Move = useCallback(
    (direction: "left" | "right" | "forward" | "back" | "stop") => {
      if (direction === "stop") return;

      setPlayer1Position(([x, y, z]) => {
        const speed = 0.1;
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
    },
    []
  );

  const handlePlayer2Move = useCallback(
    (direction: "left" | "right" | "forward" | "back" | "stop") => {
      if (direction === "stop") return;

      setPlayer2Position(([x, y, z]) => {
        const speed = 0.1;
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
    },
    []
  );

  const handlePlayer1Action = useCallback(
    (action: "punch" | "kick" | "block") => {
      if (gameState !== "playing" || action === "block") return;

      const distance = Math.hypot(
        player1Position[0] - player2Position[0],
        player1Position[2] - player2Position[2]
      );

      if (distance < 1.5) {
        const damage = action === "punch" ? 5 : 8;
        setPlayer2Health((prev) => Math.max(prev - damage, 0));
        window.dispatchEvent(new Event("Player 2-hit"));
      }
    },
    [player1Position, player2Position, gameState]
  );

  const handlePlayer2Action = useCallback(
    (action: "punch" | "kick" | "block") => {
      if (gameState !== "playing" || action === "block") return;

      const distance = Math.hypot(
        player1Position[0] - player2Position[0],
        player1Position[2] - player2Position[2]
      );

      if (distance < 1.5) {
        const damage = action === "punch" ? 5 : 8;
        setPlayer1Health((prev) => Math.max(prev - damage, 0));
        window.dispatchEvent(new Event("Player 1-hit"));
      }
    },
    [player1Position, player2Position, gameState]
  );

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Canvas shadows camera={{ position: [0, 2, 8], fov: 50 }} gl={{ antialias: true }}>
        <GameScene player1Position={player1Position} player2Position={player2Position} p1={p1} model={character.model} />
      </Canvas>

      {/* UI and Controls only during active play */}
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
          <GameController
            onPlayer1Move={handlePlayer1Move}
            onPlayer2Move={handlePlayer2Move}
            onPlayer1Action={handlePlayer1Action}
            onPlayer2Action={handlePlayer2Action}
          />
        </>
      )}

      {/* Round End Screen */}
      {gameState === "round-end" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
          <div className="text-center space-y-8">
            <h2 className="text-6xl font-bold text-yellow-400 tracking-wider animate-pulse">
              {winner?.toUpperCase()} WINS!
            </h2>
            <div className="text-4xl text-white">
              <span className="text-red-500">{player1Score}</span> - <span className="text-blue-500">{player2Score}</span>
            </div>
            <Button
              onClick={nextRound}
              size="lg"
              className="px-12 py-8 text-2xl font-bold tracking-wider bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              NEXT ROUND
            </Button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === "game-over" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-10">
          <div className="text-center space-y-10">
            <h2 className="text-8xl font-bold text-yellow-400 tracking-wider animate-pulse">VICTORY!</h2>
            <h3 className="text-5xl font-bold text-white">{winner?.toUpperCase()} WINS THE MATCH!</h3>
            <div className="text-4xl text-white">
              <span className="text-red-500">{player1Score}</span> - <span className="text-blue-500">{player2Score}</span>
            </div>
            <Button
              onClick={startGame}
              size="lg"
              className="px-12 py-8 text-2xl font-bold tracking-wider bg-red-600 hover:bg-red-700 text-white"
            >
              PLAY AGAIN
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

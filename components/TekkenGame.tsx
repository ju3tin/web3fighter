"use client";

import { Canvas } from "@react-three/fiber";
import { useState, useCallback, useEffect } from "react";
import { GameScene } from "@/components/game-scene";
import { GameUI } from "@/components/game-ui";
import { GameController } from "@/components/game-controller";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

type GameState = "playing" | "paused" | "round-end" | "game-over";

type Character = {
  id: string;
  model: string;
};

type Props = {
  selectedId?: string;
};

export default function TekkenGame({ selectedId }: Props) {
  const searchParams = useSearchParams();
  const p1 = searchParams.get("p1") ?? "jin";

  const [character, setCharacter] = useState<Character | null>(null);
  const [gameState, setGameState] = useState<GameState>("playing");

  const [player1Position, setPlayer1Position] =
    useState<[number, number, number]>([-2, 0, 0]);
  const [player2Position, setPlayer2Position] =
    useState<[number, number, number]>([2, 0, 0]);

  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const [currentRound, setCurrentRound] = useState(1);
  const [gameTime, setGameTime] = useState(99);
  const [winner, setWinner] = useState<string | null>(null);

  /* ---------------- CHARACTER LOAD ---------------- */

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const res = await fetch("/api/characters");
        const data: Character[] = await res.json();

        const result = data.find(
          (item) => item.id === (selectedId ?? p1)
        );

        setCharacter(result ?? null);
      } catch (err) {
        console.error("Failed to load character", err);
      }
    }

    fetchCharacter();
  }, [p1, selectedId]);

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setGameTime((prev) => {
        if (prev <= 1) {
          const roundWinner =
            player1Health > player2Health ? "Player 1" : "Player 2";
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
  };

  const endRound = (roundWinner: string) => {
    const p1Score =
      roundWinner === "Player 1" ? player1Score + 1 : player1Score;
    const p2Score =
      roundWinner === "Player 2" ? player2Score + 1 : player2Score;

    setPlayer1Score(p1Score);
    setPlayer2Score(p2Score);

    if (p1Score >= 2) {
      setWinner("Player 1");
      setGameState("game-over");
    } else if (p2Score >= 2) {
      setWinner("Player 2");
      setGameState("game-over");
    } else {
      setWinner(roundWinner);
      setGameState("round-end");
    }
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
  };

  /* ---------------- MOVEMENT ---------------- */

  const movePlayer = (
    setter: React.Dispatch<
      React.SetStateAction<[number, number, number]>
    >,
    direction: "left" | "right" | "forward" | "back" | "stop"
  ) => {
    if (direction === "stop") return;

    setter(([x, y, z]) => {
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
  };

  const handlePlayer1Move = useCallback(
    (d) => movePlayer(setPlayer1Position, d),
    []
  );

  const handlePlayer2Move = useCallback(
    (d) => movePlayer(setPlayer2Position, d),
    []
  );

  /* ---------------- ATTACKS ---------------- */

  const attack = (
    attackerPos: [number, number, number],
    defenderPos: [number, number, number],
    damageSetter: React.Dispatch<React.SetStateAction<number>>,
    eventName: string,
    action: "punch" | "kick" | "block"
  ) => {
    if (gameState !== "playing" || action === "block") return;

    const distance = Math.hypot(
      attackerPos[0] - defenderPos[0],
      attackerPos[2] - defenderPos[2]
    );

    if (distance < 1.5) {
      const damage = action === "punch" ? 5 : 8;
      damageSetter((hp) => Math.max(hp - damage, 0));
      window.dispatchEvent(new Event(eventName));
    }
  };

  const handlePlayer1Action = useCallback(
    (a) =>
      attack(
        player1Position,
        player2Position,
        setPlayer2Health,
        "Player2-hit",
        a
      ),
    [player1Position, player2Position, gameState]
  );

  const handlePlayer2Action = useCallback(
    (a) =>
      attack(
        player2Position,
        player1Position,
        setPlayer1Health,
        "Player1-hit",
        a
      ),
    [player1Position, player2Position, gameState]
  );

  /* ---------------- RENDER ---------------- */

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Canvas shadows camera={{ position: [0, 2, 8], fov: 50 }}>
        {character && (
          <GameScene
            player1Position={player1Position}
            player2Position={player2Position}
            p1={p1}
            model={character.model}
            animelist={character.animelist}
          />
        )}
      </Canvas>

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

      {gameState === "round-end" && (
        <Overlay
          title={`${winner?.toUpperCase()} WINS!`}
          button="NEXT ROUND"
          onClick={nextRound}
        />
      )}

      {gameState === "game-over" && (
        <Overlay
          title="VICTORY!"
          subtitle={`${winner?.toUpperCase()} WINS THE MATCH!`}
          button="PLAY AGAIN"
          onClick={startGame}
        />
      )}
    </div>
  );
}

/* ---------------- OVERLAY ---------------- */

function Overlay({
  title,
  subtitle,
  button,
  onClick,
}: {
  title: string;
  subtitle?: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
      <div className="text-center space-y-8">
        <h2 className="text-6xl font-bold text-yellow-400">{title}</h2>
        {subtitle && (
          <h3 className="text-4xl text-white">{subtitle}</h3>
        )}
        <Button
          onClick={onClick}
          size="lg"
          className="px-12 py-6 text-2xl font-bold bg-red-600 hover:bg-red-700"
        >
          {button}
        </Button>
      </div>
    </div>
  );
}

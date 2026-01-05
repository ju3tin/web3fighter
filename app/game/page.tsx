"use client"

import { Canvas } from "@react-three/fiber";
import { useState, useCallback, useEffect } from "react";
import { GameScene } from "@/components/game-scene";
import { GameUI } from "@/components/game-ui";
import { GameController } from "@/components/game-controller";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";


type GameState = "playing" | "paused" | "round-end" | "game-over"

export default function TekkenGame() {
  const [gameState, setGameState] = useState<GameState>("playing")
  const [player1Position, setPlayer1Position] = useState<[number, number, number]>([-2, 0, 0])
  const [player2Position, setPlayer2Position] = useState<[number, number, number]>([2, 0, 0])
  const [player1Health, setPlayer1Health] = useState(100)
  const [player2Health, setPlayer2Health] = useState(100)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [gameTime, setGameTime] = useState(99)
  const [winner, setWinner] = useState<string | null>(null)
  // const searchParams = useSearchParams();
  // const p1 = searchParams.get("p1");
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);


  // 

   useEffect(() => {
    async function fetchCharacters() {
      try {
        const res = await fetch('/api/characters');
        if (!res.ok) throw new Error('Failed to load characters');
        const data: Character[] = await res.json();
        setCharacters(data);
      } catch (err) {
        setError('Could not load characters. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, []);
 
  // Game timer countdown
  useEffect(() => {
    //  return null;
    setSearchParams(new URLSearchParams(window.location.search));
    if (gameState !== "playing") return

    const timer = setInterval(() => {
      setGameTime((prev) => {
        if (prev <= 1) {
          // Time's up - determine winner by health
          endRound(player1Health > player2Health ? "Player 1" : "Player 2")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer);
 //   const p1 = searchParams?.get("p1") || null;
 //    console.log(p1) || null; // logs the value
  }, [gameState, player1Health, player2Health])
 const p1 = searchParams?.get("p1") || null;
 
  
  // Check for knockout
  useEffect(() => {
    if (gameState !== "playing") return

    if (player1Health <= 0) {
      endRound("Player 2")
    } else if (player2Health <= 0) {
      endRound("Player 1")
    }
  }, [player1Health, player2Health, gameState])

  const startGame = () => {
    setGameState("playing")
    setPlayer1Health(100)
    setPlayer2Health(100)
    setGameTime(99)
    setPlayer1Position([-2, 0, 0])
    setPlayer2Position([2, 0, 0])
    setCurrentRound(1)
    setPlayer1Score(0)
    setPlayer2Score(0)
    setWinner(null)
  }

  const endRound = (roundWinner: string) => {
    if (roundWinner === "Player 1") {
      setPlayer1Score((prev) => prev + 1)
    } else {
      setPlayer2Score((prev) => prev + 1)
    }

    // Check if someone won 2 rounds (best of 3)
    const p1NewScore = roundWinner === "Player 1" ? player1Score + 1 : player1Score
    const p2NewScore = roundWinner === "Player 2" ? player2Score + 1 : player2Score

    if (p1NewScore >= 2) {
      setWinner("Player 1")
      setGameState("game-over")
    } else if (p2NewScore >= 2) {
      setWinner("Player 2")
      setGameState("game-over")
    } else {
      setWinner(roundWinner)
      setGameState("round-end")
    }
  }

  const nextRound = () => {
    setCurrentRound((prev) => prev + 1)
    setPlayer1Health(100)
    setPlayer2Health(100)
    setGameTime(99)
    setPlayer1Position([-2, 0, 0])
    setPlayer2Position([2, 0, 0])
    setWinner(null)
    setGameState("playing")
  }

  const handlePlayer1Move = useCallback((direction: "left" | "right" | "forward" | "back" | "stop") => {
    if (direction === "stop") return
    setPlayer1Position((prev) => {
      const [x, y, z] = prev
      const speed = 0.1
      if (direction === "left") return [Math.max(x - speed, -4.5), y, z]
      if (direction === "right") return [Math.min(x + speed, 4.5), y, z]
      if (direction === "forward") return [x, y, Math.max(z - speed, -2.5)]
      if (direction === "back") return [x, y, Math.min(z + speed, 2.5)]
      return prev
    })
  }, [])

  const handlePlayer2Move = useCallback((direction: "left" | "right" | "forward" | "back" | "stop") => {
    if (direction === "stop") return
    setPlayer2Position((prev) => {
      const [x, y, z] = prev
      const speed = 0.1
      if (direction === "left") return [Math.max(x - speed, -4.5), y, z]
      if (direction === "right") return [Math.min(x + speed, 4.5), y, z]
      if (direction === "forward") return [x, y, Math.max(z - speed, -2.5)]
      if (direction === "back") return [x, y, Math.min(z + speed, 2.5)]
      return prev
    })
  }, [])

  const handlePlayer1Action = useCallback(
    (action: "punch" | "kick" | "block") => {
      if (gameState !== "playing") return
      if (action === "punch" || action === "kick") {
        const distance = Math.sqrt(
          Math.pow(player1Position[0] - player2Position[0], 2) + Math.pow(player1Position[2] - player2Position[2], 2),
        )
        if (distance < 1.5) {
          setPlayer2Health((prev) => Math.max(prev - (action === "punch" ? 5 : 8), 0))
          window.dispatchEvent(new Event("Player 2-hit"))
        }
      }
    },
    [player1Position, player2Position, gameState],
  )

  const handlePlayer2Action = useCallback(
    (action: "punch" | "kick" | "block") => {
      if (gameState !== "playing") return
      if (action === "punch" || action === "kick") {
        const distance = Math.sqrt(
          Math.pow(player1Position[0] - player2Position[0], 2) + Math.pow(player1Position[2] - player2Position[2], 2),
        )
        if (distance < 1.5) {
          setPlayer1Health((prev) => Math.max(prev - (action === "punch" ? 5 : 8), 0))
          window.dispatchEvent(new Event("Player 1-hit"))
        }
      }
    },
    [player1Position, player2Position, gameState],
  )

  return (
      <Suspense fallback={<div>Loading...</div>}>
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <Canvas shadows camera={{ position: [0, 2, 8], fov: 50 }} gl={{ antialias: true }}>
        <GameScene player1Position={player1Position} p1={p1} player2Position={player2Position} />
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

    
      {/* Round End Screen */}
      {gameState === "round-end" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center space-y-8">
            <h2 className="text-6xl font-bold text-yellow-400 tracking-wider mb-4 animate-pulse">
              {winner?.toUpperCase()} WINS!
            </h2>
            <div className="text-3xl text-white mb-8">
              <span className="text-red-500">{player1Score}</span> -{" "}
              <span className="text-blue-500">{player2Score}</span>
            </div>
            <Button
              onClick={nextRound}
              size="lg"
              className="text-2xl px-12 py-8 bg-yellow-400 hover:bg-yellow-500 text-black font-bold tracking-wider"
            >
              NEXT ROUND
            </Button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === "game-over" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="text-center space-y-8">
            <h2 className="text-8xl font-bold text-yellow-400 tracking-wider mb-4 animate-pulse">VICTORY!</h2>
            <h3 className="text-5xl font-bold text-white mb-8">{winner?.toUpperCase()} WINS THE MATCH!</h3>
            <div className="text-4xl text-white mb-12">
              <span className="text-red-500">{player1Score}</span> -{" "}
              <span className="text-blue-500">{player2Score}</span>
            </div>
            <Button
              onClick={startGame}
              size="lg"
              className="text-2xl px-12 py-8 bg-red-500 hover:bg-red-600 text-white font-bold tracking-wider"
            >
              PLAY AGAIN
            </Button>
          </div>
        </div>
      )}
    </div>
      </Suspense>
  )
}

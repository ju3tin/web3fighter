"use client"

import { Canvas } from "@react-three/fiber"
import { useState, useCallback, useEffect } from "react"
import { GameScene } from "@/components/game-scene"
import { GameUI } from "@/components/game-ui"
import { GameController } from "@/components/game-controller"
import { Button } from "@/components/ui/button"

type GameState = "menu" | "playing" | "paused" | "round-end" | "game-over"

export default function TekkenGame() {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [player1Position, setPlayer1Position] = useState<[number, number, number]>([-2, 0, 0])
  const [player2Position, setPlayer2Position] = useState<[number, number, number]>([2, 0, 0])
  const [player1Health, setPlayer1Health] = useState(100)
  const [player2Health, setPlayer2Health] = useState(100)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [gameTime, setGameTime] = useState(99)
  const [winner, setWinner] = useState<string | null>(null)

  // Game timer countdown
  useEffect(() => {
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

    return () => clearInterval(timer)
  }, [gameState, player1Health, player2Health])

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
    <div className="w-full h-screen bg-black overflow-hidden relative">
     

      {gameState === "playing" && (
        <>
       
        </>
      )}

      {/* Main Menu */}
      {gameState === "menu" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center space-y-8">
            <h1 className="text-7xl font-bold text-white tracking-wider mb-4">
              <span className="text-red-500">WEB3</span> FIGHTER
            </h1>
            <p className="text-xl text-white/60 mb-8">Best of 3 Rounds</p>
            <Button
              size="lg"
              className="text-2xl px-12 py-8 bg-red-500 hover:bg-red-600 text-white font-bold tracking-wider"
            >
              START FIGHT
            </Button>
            <div className="mt-12 text-white/40 text-sm space-y-2">
              <p>Player 1: WASD + J/K/L | Player 2: Arrows + 1/2/3</p>
            </div>
          </div>
        </div>
      )}

      {/* Round End Screen */}
      {gameState === "round-end" && (
     
      )}

      {/* Game Over Screen */}
      {gameState === "game-over" && (
       
      )}
    </div>
  )
}

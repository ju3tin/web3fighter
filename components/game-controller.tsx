"use client"

import { useEffect, useRef } from "react"

interface GameControllerProps {
  onPlayer1Move: (direction: "left" | "right" | "forward" | "back" | "stop") => void
  onPlayer2Move: (direction: "left" | "right" | "forward" | "back" | "stop") => void
  onPlayer1Action: (action: "punch" | "kick" | "block") => void
  onPlayer2Action: (action: "punch" | "kick" | "block") => void
}

export function GameController({
  onPlayer1Move,
  onPlayer2Move,
  onPlayer1Action,
  onPlayer2Action,
}: GameControllerProps) {
  const keysPressed = useRef<Set<string>>(new Set())

  useEffect(() => {
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
      if (key === "a") {
        onPlayer1Move("left")
        window.dispatchEvent(new Event("Player 1-walk"))
      }
      if (key === "d") {
        onPlayer1Move("right")
        window.dispatchEvent(new Event("Player 1-walk"))
      }
      if (key === "w") {
        onPlayer1Move("forward")
        window.dispatchEvent(new Event("Player 1-walk"))
      }
      if (key === "s") {
        onPlayer1Move("back")
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
      if (key === "arrowleft") {
        onPlayer2Move("left")
        window.dispatchEvent(new Event("Player 2-walk"))
      }
      if (key === "arrowright") {
        onPlayer2Move("right")
        window.dispatchEvent(new Event("Player 2-walk"))
      }
      if (key === "arrowup") {
        onPlayer2Move("forward")
        window.dispatchEvent(new Event("Player 2-walk"))
      }
      if (key === "arrowdown") {
        onPlayer2Move("back")
        window.dispatchEvent(new Event("Player 2-walk"))
      }
      if (key === "1") {
        onPlayer2Action("punch")
        window.dispatchEvent(new Event("Player 2-punch"))
      }
      if (key === "2") {
        onPlayer2Action("kick")
        window.dispatchEvent(new Event("Player 2-kick"))
      }
      if (key === "3") {
        onPlayer2Action("block")
        window.dispatchEvent(new Event("Player 2-block"))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keysPressed.current.delete(key)

      // Player 1 stop moving
      if (["a", "d", "w", "s"].includes(key)) {
        onPlayer1Move("stop")
        window.dispatchEvent(new Event("Player 1-idle"))
      }

      // Player 1 stop blocking
      if (key === "l") {
        window.dispatchEvent(new Event("Player 1-idle"))
      }

      // Player 2 stop moving
      if (["arrowleft", "arrowright", "arrowup", "arrowdown"].includes(key)) {
        onPlayer2Move("stop")
        window.dispatchEvent(new Event("Player 2-idle"))
      }

      // Player 2 stop blocking
      if (key === "3") {
        window.dispatchEvent(new Event("Player 2-idle"))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [onPlayer1Move, onPlayer2Move, onPlayer1Action, onPlayer2Action])

  return null
}

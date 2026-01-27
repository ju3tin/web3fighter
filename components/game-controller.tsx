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
      if (key in p2MoveKeyToDir) {
        const dir = p2MoveKeyToDir[key]
        p2Move.current = dir
        onPlayer2Move(dir)
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
      if (key in p2MoveKeyToDir) {
        const releasedDir = p2MoveKeyToDir[key]
        if (p2Move.current === releasedDir) {
          const next = computeFallbackMove(p2MoveKeyToDir)
          p2Move.current = next
          onPlayer2Move(next)
          window.dispatchEvent(new Event(next === "stop" ? "Player 2-idle" : "Player 2-walk"))
        }
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

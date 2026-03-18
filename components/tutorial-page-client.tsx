"use client"

import { useState, useEffect, useCallback } from "react"
import { CharacterViewer } from "@/components/character-viewer"
import { MovesList, type Move } from "@/components/moves-list"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Info } from "lucide-react"
import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Character = {
  id: string
  name: string
  portrait: string
  model: string
  animelist: string
  moves: Move[]
}

type Props = {
  selectedId?: string
}

export default function TutorialPage({ selectedId }: Props) {
  const searchParams = useSearchParams();
  const p1 = searchParams?.get("p1") ?? "jin";
  const [character, setCharacter] = useState<Character | null>(null)
  const [selectedMove, setSelectedMove] = useState<Move | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [open, setOpen] = useState(true);
 
  const handlePlayAnimation = useCallback(() => {
    if (selectedMove) {
      setIsPlaying(true)
      setTimeout(() => setIsPlaying(false), 2000)
    }
  }, [selectedMove])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setSelectedMove(null)
  }, [])

  // Fetch character + moves
  useEffect(() => {
    async function fetchCharacter() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/character/${p1}`)
      const data: Character = await res.json()
      setCharacter(data)
    }

    fetchCharacter()
  }, [selectedId])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && selectedMove) {
        e.preventDefault()
        handlePlayAnimation()
      }

      if (e.code === "Escape") {
        handleReset()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedMove, handlePlayAnimation, handleReset])

  return (
    <TooltipProvider>
      <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
          
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                FIGHTER TUTORIAL
              </h1>
              <p className="text-xs text-muted-foreground">
                Learn moves and master your character
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset View</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-4 h-4"/> : <Volume2 className="w-4 h-4"/>}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isMuted ? "Unmute" : "Mute"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedMove ? "default" : "outline"}
                  size="icon"
                  onClick={handlePlayAnimation}
                  disabled={!selectedMove}
                >
                  {isPlaying ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {selectedMove ? "Play Animation (Space)" : "Select a move first"}
              </TooltipContent>
            </Tooltip>

          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">

          {/* 3D Viewer */}
          <div className="flex-1 relative">

            <CharacterViewer
              modelPath={character?.model ?? "/models/Xbot.glb"}
              isPlaying={isPlaying}
            />

            {!selectedMove && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 max-w-md text-center">
                  <Info className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">
                    Select a Move
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a move from the list to see the animation.
                  </p>
                </div>
              </div>
            )}

            {selectedMove && isPlaying && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <div className="bg-primary/90 rounded-lg px-6 py-3 text-primary-foreground">
                  <p className="font-bold text-center">{selectedMove.name}</p>
                </div>
              </div>
            )}

          </div>

          {/* Moves List */}
          <div id="moves-list-container">
          <div id="moves-list" className={`w-[380px] lg:w-[420px] shrink-0 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}>
            <MovesList
              moves={character?.moves ?? []}
              selectedMove={selectedMove}
              onSelectMove={setSelectedMove}
              characterName={character?.name ?? "Character"}
            />
          </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
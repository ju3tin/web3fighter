"use client"

import { useState, useEffect, useCallback } from "react"
import { CharacterViewer } from "@/components/character-viewer"
import { MovesList, type Move } from "@/components/moves-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Info } from "lucide-react"
import { useSearchParams } from "next/navigation";
import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Character = {
  id: string;
  model: string;
  animelist: string;
};

type Props = {
  selectedId?: string;
};


// Sample move data - replace with your actual moves
const sampleMoves: Move[] = [
  {
    id: "1",
    name: "Flash Punch Combo",
    command: ["1", "1", "2"],
    damage: 32,
    type: "high",
    properties: ["combo", "quick"],
    description: "A rapid three-hit combo that catches opponents off-guard. Great for pressure.",
  },
  {
    id: "2",
    name: "Rising Uppercut",
    command: ["d/f", "2"],
    damage: 25,
    type: "mid",
    properties: ["launcher", "combo"],
    description: "A powerful launcher that sends opponents airborne. Use to start big combos.",
  },
  {
    id: "3",
    name: "Sweep Kick",
    command: ["d", "3"],
    damage: 18,
    type: "low",
    properties: ["quick"],
    description: "A quick low kick that evades high attacks. Good for mix-ups.",
  },
  {
    id: "4",
    name: "Power Slam",
    command: ["1+3"],
    damage: 40,
    type: "throw",
    properties: [],
    description: "A devastating throw that slams the opponent to the ground.",
  },
  {
    id: "5",
    name: "Rage Drive",
    command: ["d/f", "1+2"],
    damage: 55,
    type: "special",
    properties: ["rage", "combo"],
    description: "A powerful rage-enhanced attack. Only available when in Rage mode.",
  },
  {
    id: "6",
    name: "Hellsweep",
    command: ["f", "n", "d", "d/f", "4"],
    damage: 21,
    type: "low",
    properties: ["combo", "launcher"],
    description: "A quick low sweep that launches on counter-hit. Key move for mix-ups.",
  },
  {
    id: "7",
    name: "Electric Wind God Fist",
    command: ["f", "n", "d", "d/f", "2"],
    damage: 30,
    type: "mid",
    properties: ["just-frame", "launcher"],
    description: "The signature move. Requires precise just-frame input for maximum effect.",
  },
  {
    id: "8",
    name: "Dragon Uppercut",
    command: ["f", "d", "d/f", "1"],
    damage: 28,
    type: "mid",
    properties: ["launcher"],
    description: "A classic shoryuken-style uppercut. Punishable on block.",
  },
  {
    id: "9",
    name: "Spinning Demon",
    command: ["4", "4", "4"],
    damage: 45,
    type: "high",
    properties: ["combo"],
    description: "A triple spinning kick combo. High damage but risky.",
  },
  {
    id: "10",
    name: "Tackle",
    command: ["f", "f", "1+2"],
    damage: 35,
    type: "throw",
    properties: ["ground"],
    description: "A running tackle that takes the fight to the ground.",
  },
]

export default function TutorialPage({ selectedId }: Props) {
  const searchParams = useSearchParams();
  const p1 = searchParams?.get("p1") ?? "jin";
  const [character, setCharacter] = useState<Character | null>(null);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [moves, setMoves] = useState<Move[] | null>(null);
  const handlePlayAnimation = useCallback(() => {
    if (selectedMove) {
      setIsPlaying(true)
      // Auto-stop after animation duration (adjust as needed)
      setTimeout(() => setIsPlaying(false), 2000)
    }
  }, [selectedMove])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setSelectedMove(null)
  }, [])


  useEffect(() => {
    async function fetchMoves() {
      const res = await fetch("/api/moveslist");
      const data: { id: string; movelist: Move[] }[] = await res.json();
      const result = data.find(
        (item) => item.id === (selectedId ?? p1)
      );
      setMoves(result?.movelist ?? null);
    }
    fetchMoves();
  }, [selectedId, p1]);

  useEffect(() => {
    async function fetchCharacter() {
      const res = await fetch("/api/characters");
      const data: Character[] = await res.json();

      const result = data.find(
        (item) => item.id === (selectedId ?? p1)
      );

      setCharacter(result ?? null);
    }

    fetchCharacter();
  }, [p1, selectedId]);


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
                  className="border-border hover:bg-secondary"
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
                  className="border-border hover:bg-secondary"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
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
                  className={selectedMove ? "bg-primary hover:bg-primary/90" : "border-border"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
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
          {/* 3D Viewer - Left Side */}
          <div className="flex-1 relative">
          <CharacterViewer
  modelPath={character?.model ?? "/models/Xbot.glb"}
  isPlaying={isPlaying}
/>

            {/* Info overlay when no move is selected */}
            {!selectedMove && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 max-w-md text-center">
                  <Info className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Select a Move
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a move from the list on the right to see the animation
                    and learn the command inputs.
                  </p>
                </div>
              </div>
            )}

            {/* Move info overlay when playing */}
            {selectedMove && isPlaying && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <div className="bg-primary/90 backdrop-blur-sm rounded-lg px-6 py-3 text-primary-foreground">
                  <p className="font-bold text-center">{selectedMove.name}</p>
                </div>
              </div>
            )}

            {/* Command display when move is selected */}
            {selectedMove && !isPlaying && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-6 py-4">
                  <p className="text-xs text-muted-foreground mb-2 text-center">
                    Command Input
                  </p>
                  <div className="flex items-center gap-2">
                    {selectedMove.command.map((input, index) => (
                      <span key={index} className="flex items-center">
                        <kbd className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 bg-secondary border-2 border-border rounded-md text-sm font-mono font-bold text-foreground shadow-sm">
                          {input}
                        </kbd>
                        {index < selectedMove.command.length - 1 && (
                          <span className="text-primary font-bold mx-1">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Moves List - Right Side */}
          <div className="w-[380px] lg:w-[420px] shrink-0">
            <MovesList
              moves={sampleMoves}
              selectedMove={selectedMove}
              onSelectMove={setSelectedMove}
              characterName="Iron Fist"
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

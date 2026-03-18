"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "./ui/button"

export interface Move {
  id: string
  name: string
  command: string[]
  damage: number
  type: "high" | "mid" | "low" | "throw" | "special"
  properties?: string[]
  description?: string
  animationFile?: string
}

interface MovesListProps {
  moves: Move[]
  selectedMove: Move | null
  onSelectMove: (move: Move) => void
  characterName: string
}

 const handleClick = () => {
    const element = document.getElementById("moves-list");
    if (element) {
      // Remove all class names
 //     element.className = "";
element.style.display = "none";
      // Set width to 0px
 //     element.style.width = "0px";
    }
    const maximizeButton = document.getElementById("maximize-button");
    if (maximizeButton) {
      maximizeButton.style.removeProperty('display');
    }
    const gameController1 = document.getElementById("game-controller-1");
    if (gameController1) {
      gameController1.style.display = "none";
    }
}

const moveCategories = [
  { id: "all", label: "All" },
  { id: "basic", label: "Basic" },
  { id: "combo", label: "Combos" },
  { id: "special", label: "Special" },
  { id: "throw", label: "Throws" },
]

const typeColors: Record<Move["type"], string> = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  mid: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  throw: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  special: "bg-primary/20 text-primary border-primary/30",
}

function CommandDisplay({ command }: { command: string[] }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {command.map((input, index) => (
        <span key={index}>
          <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-secondary border border-border rounded text-xs font-mono text-foreground">
            {input}
          </kbd>
          {index < command.length - 1 && (
            <span className="text-muted-foreground mx-0.5">+</span>
          )}
        </span>
      ))}
    </div>
  )
}



function MoveCard({
  move,
  isSelected,
  onClick,
}: {
  move: Move
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all duration-200",
        "hover:bg-secondary/50 hover:border-primary/50",
        isSelected
          ? "bg-primary/10 border-primary"
          : "bg-card/50 border-border"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-foreground">{move.name}</h4>
        <Badge variant="outline" className={cn("text-xs", typeColors[move.type])}>
          {move.type.toUpperCase()}
        </Badge>
      </div>
      
      <CommandDisplay command={move.command} />
      
      <div className="flex items-center gap-4 mt-3 text-sm">
        <span className="text-muted-foreground">
          Damage: <span className="text-primary font-semibold">{move.damage}</span>
        </span>
        {move.properties && move.properties.length > 0 && (
          <div className="flex gap-1">
            {move.properties.map((prop) => (
              <span
                key={prop}
                className="px-1.5 py-0.5 bg-muted rounded text-xs text-muted-foreground"
              >
                {prop}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}

export function MovesList({
  moves,
  selectedMove,
  onSelectMove,
  characterName,
}: MovesListProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [open, setOpen] = useState(true); // ✅ correct
  const filteredMoves = moves.filter((move) => {
    if (activeCategory === "all") return true
    if (activeCategory === "basic") return ["high", "mid", "low"].includes(move.type)
    if (activeCategory === "combo") return move.properties?.includes("combo")
    if (activeCategory === "special") return move.type === "special"
    if (activeCategory === "throw") return move.type === "throw"
    return true
  })

  return (
    <div className="flex flex-col h-full bg-card/30 backdrop-blur-sm border-l border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground mb-1">{characterName}</h2>
        <p className="text-sm text-muted-foreground">Move List & Tutorials</p>
        <div style={{ display: "flex", justifyContent: "flex-end", top: "-10px" }}>
        <Button color="secondary" onClick={() => {handleClick(); setOpen(!open)}}>Minimize</Button>
</div>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1 flex flex-col">
        <div className="px-4 pt-2 border-b border-border">
          <TabsList className="w-full bg-secondary/30 h-auto flex-wrap">
            {moveCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeCategory} className="flex-1 mt-0 p-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-4 space-y-3">
              {filteredMoves.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No moves found in this category
                </div>
              ) : (
                filteredMoves.map((move) => (
                  <MoveCard
                    key={move.id}
                    move={move}
                    isSelected={selectedMove?.id === move.id}
                    onClick={() => onSelectMove(move)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {selectedMove && (
        <div className="p-4 border-t border-border bg-secondary/20">
          <h4 className="font-semibold text-foreground mb-2">Selected Move</h4>
          <p className="text-sm text-muted-foreground">
            {selectedMove.description || `Execute ${selectedMove.name} to deal ${selectedMove.damage} damage.`}
          </p>
          <div className="mt-3 flex gap-2">
            <span className="px-2 py-1 bg-primary/10 border border-primary/30 rounded text-xs text-primary">
              Press SPACE to play animation
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

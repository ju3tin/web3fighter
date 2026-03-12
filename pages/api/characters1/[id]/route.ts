import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const [charactersRes, movesRes] = await Promise.all([
    fetch("http://localhost:3000/api/characters"),
    fetch("http://localhost:3000/api/moveslist")
  ])

  const characters = await charactersRes.json()
  const movesData = await movesRes.json()

  const character = characters.find((c: any) => c.id === id)
  const moves = movesData.find((m: any) => m.id === id)?.movelist ?? []

  if (!character) {
    return NextResponse.json(
      { error: "Character not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    ...character,
    moves
  })
}
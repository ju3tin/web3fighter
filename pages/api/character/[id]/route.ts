import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  const [charactersRes, movesRes] = await Promise.all([
    fetch(`/api/characters`),
    fetch(`/api/moveslist`)
  ])

  const characters = await charactersRes.json()
  const movesData = await movesRes.json()

  const character = characters.find((c: any) => c.id === id)
  const moves = movesData.find((m: any) => m.id === id)?.movelist ?? []

  if (!character) {
    return NextResponse.json({ error: "Character not found" }, { status: 404 })
  }

  return NextResponse.json({
    ...character,
    moves
  })
}
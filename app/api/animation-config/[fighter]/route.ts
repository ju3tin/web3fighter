import { NextRequest, NextResponse } from "next/server";
import configs from "@/data/animationConfigs.json";

export async function GET(
  request: NextRequest,
  { params }: { params: { fighter: string } }
) {
  const fighter = params.fighter.toLowerCase();

  if (!configs[fighter as keyof typeof configs]) {
    return NextResponse.json(
      { error: `Animation config for ${fighter} not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(configs[fighter as keyof typeof configs]);
}

import { NextResponse } from "next/server";
import credits from "@/data/credits.json";

export async function GET() {
  return NextResponse.json(credits);
}

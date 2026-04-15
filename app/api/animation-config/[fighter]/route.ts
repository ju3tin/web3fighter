import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Use dynamic import or fs.readFile for more reliability on Vercel
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fighter: string }> }
) {
  try {
    const { fighter } = await params;
    const fighterName = fighter.toLowerCase().trim();

    // Path to your JSON file
    const filePath = path.join(process.cwd(), "data", "animationConfigs.json");
    
    let configs;
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      configs = JSON.parse(fileContent);
    } catch (fileErr) {
      console.error("Failed to read animationConfigs.json:", fileErr);
      return NextResponse.json(
        { error: "Animation config file not found" },
        { status: 500 }
      );
    }

    if (!configs[fighterName]) {
      return NextResponse.json(
        { error: `No config found for fighter: ${fighterName}` },
        { status: 404 }
      );
    }

    // Add cache headers for better performance
    return NextResponse.json(configs[fighterName], {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

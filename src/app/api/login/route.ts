import { NextResponse } from "next/server";
import db from "@/lib/database";

export async function GET() {
  const player = db
    .prepare("SELECT streak FROM player WHERE id = 1")
    .get();

  return NextResponse.json(player);
}

export async function POST() {
  const result = db
    .prepare(`
      UPDATE player
      SET streak = streak + 1
      WHERE id = 1
    `)
    .run();

  console.log("Updated rows:", result.changes);

  const player = db
    .prepare("SELECT streak FROM player WHERE id = 1")
    .get();

  return NextResponse.json(player);
}
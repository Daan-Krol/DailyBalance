import { NextResponse } from "next/server";
import db from "@/lib/database";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "Date is required" },
      { status: 400 }
    );
  }

  const day = db
    .prepare(`
      SELECT *
      FROM day
      WHERE player_id = 1 AND date = ?
    `)
    .get(date);

  return NextResponse.json(day ?? null);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { date, sleep, water, exercised } = body;

  db.prepare(`
    INSERT INTO day (player_id, date, sleep, water, exercised)
    VALUES (1, ?, ?, ?, ?)
    ON CONFLICT(player_id, date)
    DO UPDATE SET
      sleep = excluded.sleep,
      water = excluded.water,
      exercised = excluded.exercised
  `).run(date, sleep, water, exercised);

  const day = db
    .prepare(`
      SELECT *
      FROM day
      WHERE player_id = 1 AND date = ?
    `)
    .get(date);

  return NextResponse.json(day);
}
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Gli acquisti non sono disponibili. L'accesso viene assegnato dallo staff." },
    { status: 410 }
  );
}

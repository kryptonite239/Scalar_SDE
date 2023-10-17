import connectMongo from "@/lib/connectdb";
import Room from "@/lib/schema/roomschema";
import { NextResponse } from "next/server";
export async function GET() {
  connectMongo();
  const rooms = await Room.find().sort({ room_no: 1 });
  return NextResponse.json({ rooms });
}

export async function POST(request) {
  const body = await request.json();
  const { id } = body;
  const room = await Room.findById(id);
  return NextResponse.json({ room });
}

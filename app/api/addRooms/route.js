import connectMongo from "@/lib/connectdb";
import Room from "@/lib/schema/roomschema";
import { NextResponse } from "next/server";
export async function POST(req, res) {
  connectMongo();
  const body = await req.json();
  const { room_no, type, price } = body;
  console.log({ room_no, type, price });
  const room = new Room({
    room_no: room_no,
    type: type,
    price: price,
    allBookings: [],
  });
  room.save();
  return NextResponse.json({ message: "room added" });
}

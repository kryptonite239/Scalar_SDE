import connectMongo from "@/lib/connectdb";
import Bookings from "@/lib/schema/bookings";
import Room from "@/lib/schema/roomschema";
import { NextResponse } from "next/server";
export async function POST(request) {
  connectMongo();
  const body = await request.json();
  const { room_id, room_no, email, starttime, endtime, price } = body;
  console.log({ room_id, room_no, email, starttime, endtime, price });
  const booking = new Bookings({
    room_id: room_id,
    room_no: room_no,
    email,
    starttime: starttime,
    endtime: endtime,
    price,
    isBooked: true,
  });
  await booking.save();
  const room = await Room.findById(room_id);
  room.allBookings.push(booking);
  await room.save();

  return NextResponse.json({
    message: "Room Booked",
  });
}

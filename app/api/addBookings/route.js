import connectMongo from "@/lib/connectdb";
import Bookings from "@/lib/schema/bookings";
import Room from "@/lib/schema/roomschema";
import { NextResponse } from "next/server";
import dayjs from "dayjs";
export async function POST(request) {
  connectMongo();
  const body = await request.json();
  const { room_id, room_no, email, starttime, endtime, price } = body;
  console.log({ room_id, room_no, email, starttime, endtime, price });
  const startDate = new Date(starttime).toLocaleDateString();
  const endDate = new Date(endtime).toLocaleDateString();
  const booking = new Bookings({
    room_id: room_id,
    room_no: room_no,
    email,
    starttime: startDate,
    endtime: endDate,
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
export async function PUT(request) {
  const body = await request.json();

  const { id, bookingDetails } = body;
  let overlap = false;
  const room = await Room.findOne({ room_no: bookingDetails.room_no });
  if (room.allBookings.length > 0) {
    room.allBookings.map((booking) => {
      if (booking._id != id) {
        const st = new dayjs(booking.starttime);
        const en = new dayjs(booking.endtime);
        const start = new dayjs(bookingDetails.starttime);
        const end = new dayjs(bookingDetails.endtime);
        const stDiff = start.diff(st, "h") / 24;
        const enDiff = end.diff(en, "h") / 24;
        const startDiff = start.diff(en, "h") / 24;
        const endDiff = end.diff(st, "h") / 24;
        if (
          (stDiff <= 0 && endDiff >= 0) ||
          (stDiff <= 0 && startDiff >= 0) ||
          (endDiff >= 0 && enDiff <= 0)
        ) {
          console.log("Booking overlap");
          overlap = true;
        }
      }
    });
  }
  if (!overlap) {
    await Bookings.findOneAndUpdate(
      { _id: id },
      {
        room_id: bookingDetails.room_id,
        room_no: bookingDetails.room_no,
        email: bookingDetails.email,
        starttime: bookingDetails.starttime,
        endtime: bookingDetails.endtime,
        price: bookingDetails.price,
        isBooked: bookingDetails.isBooked,
      }
    );
    return NextResponse.json({ message: "Details Updated" });
  } else {
    return NextResponse.json({ status: 404, statusText: "Room Overlapping" });
  }
}
export async function DELETE(request) {
  const body = await request.json();
  const { _id, room_id } = body;
  const room = await Room.findById(room_id);

  let date = new Date().toLocaleDateString;
  date = new dayjs(date);
  const startDate = new dayjs(body.starttime);
  const refund = startDate.diff(date, "h");
  room.allBookings = room.allBookings.filter((booking) => booking._id !== _id);
  await room.save();
  await Bookings.findByIdAndDelete(_id);
  return NextResponse.json({
    status: 201,
    statusText: `${
      refund < 24 ? "No Refund" : refund <= 48 ? "25% Refund" : "50% Refund"
    }`,
  });
}

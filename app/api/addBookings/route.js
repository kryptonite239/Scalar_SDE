import connectMongo from "@/lib/connectdb";
import Bookings from "@/lib/schema/bookings";
import Room from "@/lib/schema/roomschema";
import { NextResponse } from "next/server";
import dayjs from "dayjs";
export async function POST(request) {
  connectMongo();
  const body = await request.json();
  const { room_id, room_no, email, starttime, endtime, price } = body;
  const startDate = new dayjs(starttime).format("DD-MM-YYYY");
  const endDate = new dayjs(endtime).format("DD-MM");
  const room = await Room.findById(room_id);
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

  room.allBookings.push(booking);
  await room.save();

  return NextResponse.json({
    status: 201,
    statusText: "Room Booked Successfully",
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
  const { _id, room_id, room_no, starttime } = body;
  const date = new dayjs();
  const start = new dayjs(starttime);
  // console.log({ date, start });
  const refund = start.diff(date, "h");
  const room = await Room.findById({ _id: room_id });
  let bookings = room.allBookings;
  bookings = bookings.filter((booking) => booking._id !== _id);
  await Room.findByIdAndUpdate(
    { _id: room_id },
    { allBookings: { ...bookings } }
  );
  await Bookings.findByIdAndDelete(_id);
  console.log("Refund ", refund);
  return NextResponse.json({
    status: 201,
    statusText: `${
      refund < 24 ? "No Refund" : refund <= 48 ? "25% Refund" : "50% Refund"
    }`,
  });
}

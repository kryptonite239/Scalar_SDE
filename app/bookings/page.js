"use client";

import { useEffect, useState } from "react";
import BookingCard from "../components/BookingCard";

export default function BookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [rooms, setRooms] = useState(null);
  const roomsList = [];
  useEffect(() => {
    fetch("http://localhost:3000/api/getBookings")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings));
    fetch("http://localhost:3000/api/getRooms")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data.rooms);
        data.rooms.map((room) => {
          roomsList.push({
            no: room.room_no,
            id: room._id,
            type: room.type,
            price: room.price,
          });
        });
      });
  }, []);
  return (
    <>
      {bookings == null ? (
        <>No Bookings to be shown!</>
      ) : (
        <div className="w-full">
          {bookings.map((booking) => {
            return (
              <div key={booking._id}>
                <BookingCard details={booking} rooms={roomsList} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

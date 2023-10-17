"use client";

import { useEffect, useState } from "react";
import BookingCard from "../components/BookingCard";

export default function BookingsPage() {
  const [bookings, setBookings] = useState(null);
  useEffect(() => {
    fetch("http://localhost:3000/api/getBookings")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings));
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
                <BookingCard details={booking} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

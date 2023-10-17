"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
export default function RoomDetails() {
  const [room, setRoom] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setemail] = useState("");
  const [starttime, setStartTime] = useState("");
  const [endtime, setEndTime] = useState("");
  const [amount, setAmount] = useState(1);
  const id = searchParams.get("room");
  useEffect(() => {
    fetch("http://localhost:3000/api/getRooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRoom(data.room);
      });
    handlePrice();
    // setAmount(final);
  }, [endtime, starttime]);

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log(room);
    let overlap = false;
    if (room.allBookings.length > 0) {
      room.allBookings.map((booking) => {
        if (booking.isBooked == true) {
          const st = new dayjs(booking.starttime);
          const en = new dayjs(booking.endtime);
          const start = new dayjs(starttime);
          const end = new dayjs(endtime);
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
      fetch("http://localhost:3000/api/addBookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: id,
          room_no: room.room_no,
          email,
          price: amount,
          starttime,
          endtime,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
      router.push("/");
    }
  };
  const handlePrice = () => {
    if (starttime.length == 0 || endtime.length == 0) return;
    const s = new dayjs(starttime);
    const e = new dayjs(endtime);
    const diffDays = e.diff(s, "h") / 24;
    setAmount(diffDays + 1);
  };

  return (
    <>
      {room && (
        <div>
          <ul>
            <li>Room Number: {room.room_no}</li>
            <li>Type:{room.type}</li>
            <li>Price per hour: {room.price}</li>
          </ul>
          <form onSubmit={handlesubmit}>
            <input
              type="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <input
              type="date"
              placeholder="Start time"
              required
              value={starttime}
              onChange={(e) => {
                setStartTime(e.target.value);
              }}
            />
            <input
              type="date"
              placeholder="End time"
              required
              value={endtime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            <p>₹ {amount * room.price}</p>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </>
  );
}

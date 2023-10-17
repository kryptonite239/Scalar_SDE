"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
export default function RoomDetails() {
  const [room, setRoom] = useState(null);
  const searchParams = useSearchParams();

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
        setAmount(data.room.price);
      });
  }, []);
  const [email, setemail] = useState("");
  const [starttime, setStartTime] = useState("");
  const [endtime, setEndTime] = useState("");
  const [amount, setAmount] = useState();
  const handlesubmit = (e) => {
    e.preventDefault();
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
              type="time"
              placeholder="Start time"
              required
              value={starttime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <input
              type="time"
              placeholder="End time"
              required
              value={endtime}
              onChange={(e) => {
                setEndTime(e.target.value);
                console.log({ endtime, starttime });
              }}
            />
            <p>₹ {amount}</p>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </>
  );
}

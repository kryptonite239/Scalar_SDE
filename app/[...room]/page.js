"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
export default function RoomDetails() {
  const [room, setRoom] = useState(null);
  const toast = useRef(null);
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
  }, [endtime, starttime]);
  const handlesubmit = (e) => {
    e.preventDefault();
    let overlapping = false;
    room.allBookings.map((booking) => {
      if (booking.isBooked) {
        const st = new dayjs(booking.starttime);
        const en = new dayjs(booking.endtime);
        const start = new dayjs(starttime);
        const end = new dayjs(endtime);
        const stDiff = start.diff(st, "d");
        const enDiff = end.diff(en, "d");
        const startDiff = start.diff(en, "d");
        const endDiff = end.diff(st, "d");
        if (
          (stDiff <= 0 && endDiff >= 0) ||
          (stDiff <= 0 && startDiff >= 0) ||
          (endDiff >= 0 && enDiff <= 0)
        ) {
          overlapping = true;
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Room Booking Overlapped",
            life: 3000,
          });
        }
      }
    });
    if (!overlapping) {
      fetch("http://localhost:3000/api/addBookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: id,
          room_no: room.room_no,
          email,
          price: amount * room.price,
          starttime,
          endtime,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status == 404) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: data.statusText,
              life: 3000,
            });
          } else {
            toast.current.show({
              severity: "success",
              summary: "Booked!",
              detail: data.statusText,
              life: 3000,
            });
            router.push("/");
          }
        });
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
        <div className="w-1/3 h-1/2 flex flex-col justify-center items-center mt-40">
          <Toast ref={toast} />
          <ul className=" w-full h-[40px] flex justify-center items-center gap-4 text-2xl">
            <li>Room Number: {room.room_no}</li>
            <li>Type: {room.type}</li>
            <li>Price per night: ₹{room.price}</li>
          </ul>
          <div className="flex w-full h-[300px] ">
            <form
              onSubmit={handlesubmit}
              className="flex w-full h-full flex-col items-center justify-center gap-3"
            >
              <div className="flex w-full h-[50px] items-center justify-center gap-5">
                <span className="p-float-label">
                  <InputText
                    type="email"
                    placeholder="Enter email"
                    required
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                  />
                  <label htmlFor="email">E-mail</label>
                </span>
                <span className="p-float-label">
                  <Calendar
                    required
                    value={starttime}
                    onChange={(e) => {
                      setStartTime(e.value);
                    }}
                    dateFormat="dd/mm/yy"
                    showIcon
                  />
                  <label htmlFor="start_date">Start Date</label>
                </span>
                <span className="p-float-label">
                  <Calendar
                    required
                    value={endtime}
                    onChange={(e) => {
                      setEndTime(e.value);
                    }}
                    dateFormat="dd/mm/yy"
                    showIcon
                  />
                  <label htmlFor="end_date">End Date</label>
                </span>
              </div>
              <p>
                ₹{" "}
                {amount > 0
                  ? amount * room.price
                  : toast.current.show({
                      severity: "error",
                      summary: "Incorrect Details",
                      detail: "Please Select Dates Again!",
                      life: 3000,
                    })}
              </p>
              <Button type="submit" outlined severity="success">
                Submit
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

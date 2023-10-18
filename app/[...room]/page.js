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
    fetch("/api/getRooms", {
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
      fetch("https://scalar-sde.vercel.app/api/addBookings", {
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
        <div className="w-full  h-[100vh] flex flex-col justify-evenly items-center">
          <Toast ref={toast} />

          <div className="flex w-full h-full ">
            <form
              onSubmit={handlesubmit}
              className="flex w-full h-full flex-col items-center gap-3 mt-10"
            >
              <div className="flex md:h-[300px] md:w-[700px] h-[250px] w-[300px] items-center justify-center border-2 border-black rounded-lg bg-slate-50 flex-col gap-5">
                <span className="p-float-label">
                  <InputText
                    type="email"
                    placeholder="Enter email"
                    required
                    value={email}
                    className="w-[200px] lg:w-[500px] md:w-[300px]"
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
                    className="w-[200px] lg:w-[500px] md:w-[300px]"
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
                    className="w-[200px] lg:w-[500px] md:w-[300px]"
                  />
                  <label htmlFor="end_date">End Date</label>
                </span>
              </div>

              <div className="flex md:h-[150px] md:w-[700px] h-[150px] w-[300px] items-center justify-between border-2 border-black rounded-lg bg-slate-50">
                <ul className=" w-1/2 h-full flex flex-col justify-center items-center font-semibold gap-2 lg:text-[17px]  text-[11px] md:text-[13px]">
                  <li>Room Number: {room.room_no}</li>
                  <li>Type: {room.type}</li>
                  <li>Price per night: ₹{room.price}</li>
                </ul>
                <div className="flex flex-col w-1/2 h-full items-center justify-evenly">
                  <p className="text-[20px] font-bold text-green-600">
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
                  <div>
                    <Button type="submit" severity="success">
                      Book
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

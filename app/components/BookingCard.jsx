"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
export default function BookingCard({ details }) {
  const [reciept, setReciept] = useState(details);
  const [dummy, setDummy] = useState(reciept);
  const [editAccess, setEditAccess] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/api/addBookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: details._id,
        bookingDetails: {
          email: dummy.email,
          starttime: dummy.starttime,
          endtime: dummy.endtime,
          price: dummy.price,
          isBooked: dummy.isBooked,
          room_id: dummy.room_id,
          room_no: dummy.room_no,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status == 404) {
          setDummy(reciept);
        } else {
          setReciept(dummy);
          setEditAccess(!editAccess);
        }
      });
  };
  const handleCancel = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/addBookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: details._id,
        bookingDetails: {
          isBooked: false,
        },
      }),
    }).then(() => setReciept({ ...reciept, isBooked: false }));
  };
  return (
    <div className="w-full h-[150px] flex  flex-col align-center">
      <ul className="w-full h-full flex align-center justify-evenly">
        <li>Room No:{reciept.room_no}</li>
        <li>Price: {reciept.price}</li>
        <li>Start Time: {reciept.starttime}</li>
        <li>End Time: {reciept.endtime}</li>
        <li>
          Booking Status:
          {reciept.isBooked == true ? <>Booked</> : <>Cancelled</>}
        </li>
        {reciept.isBooked && (
          <div>
            <Button onClick={() => setEditAccess(!editAccess)}>Edit</Button>
            <Button variant={"destructive"} onClick={handleCancel}>
              Cancel Booking
            </Button>
          </div>
        )}
      </ul>
      {editAccess && (
        <div className="w-full flex justify-center">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={dummy.email}
              onChange={(e) => setDummy({ ...dummy, email: e.target.value })}
              placeholder="enter email"
              required
            />
            <input
              type="date"
              value={dummy.starttime}
              onChange={(e) =>
                setDummy({ ...dummy, starttime: e.target.value })
              }
              required
            />
            <input
              type="date"
              value={dummy.endtime}
              onChange={(e) => setDummy({ ...dummy, endtime: e.target.value })}
              required
            />
            <p>{reciept.price}</p>
            <Button>Save Changes</Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDummy(reciept);
                setEditAccess(!editAccess);
              }}
            >
              Cancel
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

"use client";
import Room from "./components/Room";
import { useEffect, useState } from "react";
export default function Home() {
  const [rooms, setRooms] = useState(null);
  useEffect(() => {
    fetch("http://localhost:3000/api/getRooms")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data.rooms);
      });
  }, []);
  return (
    <main className="w-full mt-10">
      {rooms && (
        <div className="w-full flex flex-col items-center justify-start">
          {rooms.map((room) => {
            return (
              <div
                key={room.room_no}
                className=" w-3/4 h-[100px] border-2 border-black rounded-2xl m-3 flex items-center p-5"
              >
                <Room room={room} />
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

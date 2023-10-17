"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
export default function Room({ room }) {
  return (
    <div className="w-full h-full text-xl font-extrabold flex justify-between items-center">
      <div className="w-1/4 flex flex-col h-full justify-center">
        <div>Room-No: {room.room_no}</div>
        <div className="font-light">Type: {room.type}</div>
        <div>Price: {room.price}</div>
      </div>
      <div className="h-full flex items-center">
        <Link href={{ pathname: "/room", query: { room: room._id } }}>
          <Button>Check Availability</Button>
        </Link>
      </div>
    </div>
  );
}

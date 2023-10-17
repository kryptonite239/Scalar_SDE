import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <nav className="w-1/4 h-[70px] border-2 border-black rounded-full flex items-center justify-center">
      <ul className="flex w-full items-center justify-evenly">
        <li className=" font-bold hover:underline">
          <Link href="/">Rooms</Link>
        </li>
        <li className=" font-bold hover:underline">
          <Link href="/bookings">Bookings</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

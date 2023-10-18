import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <nav className="md:w-1/4 w-[300px] text-sm md:text-lg h-[70px] border-2 border-black rounded-full flex items-center justify-center">
      <ul className="flex w-full items-center justify-evenly">
        <li className=" font-bold hover:underline">
          <Link href="/">Rooms</Link>
        </li>
        <li className=" font-bold hover:underline">
          <Link href="/bookings">Bookings</Link>
        </li>
        <li>
          <Link href={"https://github.com/kryptonite239/Scalar_SDE"}>
            <i className="pi pi-github" style={{ fontSize: "1.4rem" }}></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

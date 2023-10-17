import Bookings from "@/lib/schema/bookings";
import connectMongo from "@/lib/connectdb";
import { NextResponse } from "next/server";
export async function GET() {
  connectMongo();
  const bookings = await Bookings.find().sort({ price: 1 });
  return NextResponse.json({ bookings });
}

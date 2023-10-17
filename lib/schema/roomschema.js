import { Schema, models, model } from "mongoose";
import bookings from "./bookings";
const roomSchema = new Schema({
  room_no: Number,
  type: String,
  price: Number,
  allBookings: [],
});

const Room = models.room || model("room", roomSchema);

export default Room;

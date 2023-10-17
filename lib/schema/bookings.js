import { Schema, models, model } from "mongoose";

const bookingsSchema = new Schema({
  room_id: String,
  room_no: Number,
  email: String,
  starttime: String,
  endtime: String,
  price: Number,
  isBooked: Boolean,
});

const Bookings = models.booking || model("booking", bookingsSchema);
export default Bookings;

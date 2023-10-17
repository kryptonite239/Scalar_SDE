import { Schema, models, model } from "mongoose";

const bookingsSchema = new Schema({
  id: String,
  email: String,
  startDate: Date,
  endDate: Date,
  price: Number,
  isBooked: Boolean,
  status: String,
});

const bookings = models.bookings || model("bookings", bookingsSchema);
export default bookings;

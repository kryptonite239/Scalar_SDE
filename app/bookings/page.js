"use client";

import { useEffect, useState } from "react";
import BookingCard from "../components/BookingCard";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function BookingsPage() {
  const [bookings, setBookings] = useState(null);
  useEffect(() => {
    fetch("http://localhost:3000/api/getBookings")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings));
  }, []);
  return (
    <>
      {bookings == null ? (
        <>No Bookings to be shown!</>
      ) : (
        <div className="card">
          <DataTable
            value={bookings}
            tableStyle={{ minWidth: "50rem" }}
            showGridlines
            paginator
            rows={5}
            editMode="row"
            dataKey="id"
          >
            <Column
              field="room_no"
              header="Number"
              sortable
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="email"
              header="E-Mail"
              sortable
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="starttime"
              header="Start Date"
              sortable
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="endtime"
              header="End Date"
              sortable
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="price"
              header="Price"
              sortable
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="isBooked"
              header="Status"
              sortable
              style={{ width: "25%" }}
            ></Column>
            <Column
              rowEditor
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            ></Column>
          </DataTable>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { ContextMenu } from "primereact/contextmenu";
import { Message } from "primereact/message";
export default function BookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const toast = useRef(null);
  const cm = useRef(null);
  useEffect(() => {
    fetch("https://scalar-sde.vercel.app/api/getBookings")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings));
  }, []);
  const menuModel = [
    {
      label: "Delete",
      icon: "pi pi-fw pi-times",
      command: () => deleteBooking(selectedBooking),
    },
  ];
  const deleteBooking = (booking) => {
    let _bookings = [...bookings];
    console.log(booking);
    fetch("https://scalar-sde.vercel.app/api/addBookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    })
      .then((res) => res.json())
      .then((data) => {
        _bookings = _bookings.filter((p) => p._id !== booking._id);
        toast.current.show({
          severity: "info",
          summary: "Booking Cancelled",
          detail: data.statusText,
        });
        setBookings(_bookings);
      });
  };
  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };
  const rowClassName = (data) => (isSelectable(data) ? "" : "p-disabled");

  const dateEditor = (options) => {
    return (
      <Calendar
        dateFormat="dd/mm/yy"
        value={options.value}
        onChange={(e) => {
          const date = new Date(e.value).toLocaleDateString();
          return options.editorCallback(date);
        }}
        showIcon
      />
    );
  };
  const isSelectable = (data) => data.isBooked === true;
  const isRowSelectable = (event) =>
    event.data ? isSelectable(event.data) : true;
  const onRowEditComplete = (e) => {
    let _bookings = [...bookings];
    let { newData, index } = e;
    fetch("https://scalar-sde.vercel.app/api/addBookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newData._id,
        bookingDetails: {
          email: newData.email,
          starttime: newData.starttime,
          endtime: newData.endtime,
          price: newData.price,
          isBooked: newData.isBooked,
          room_id: newData.room_id,
          room_no: newData.room_no,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.current.show({
          severity: "success",
          summary: data.message,
          detail: "Booking Details Updated",
          life: 3000,
        });
        _bookings[index] = newData;

        setBookings(_bookings);
      });
  };
  return (
    <>
      {bookings == null ? (
        <>No Bookings to be shown!</>
      ) : (
        <div className="card flex flex-col w-full h-[100vh] gap-5 ">
          <Toast ref={toast} />
          <ContextMenu
            model={menuModel}
            ref={cm}
            onHide={() => setSelectedBooking(null)}
          />
          <DataTable
            value={bookings}
            tableStyle={{ minWidth: "50rem" }}
            showGridlines
            paginator
            rows={5}
            editMode="row"
            dataKey="id"
            onRowEditComplete={onRowEditComplete}
            isDataSelectable={isRowSelectable}
            selection={selectedBooking}
            selectionMode="single"
            onSelectionChange={(e) => setSelectedBooking(e.value)}
            rowClassName={rowClassName}
            onContextMenu={(e) => cm.current.show(e.originalEvent)}
            contextMenuSelection={selectedBooking}
            onContextMenuSelectionChange={(e) => setSelectedBooking(e.value)}
          >
            <Column
              field="room_no"
              header="Number"
              sortable
              style={{ width: "25%" }}
              editor={(options) => textEditor(options)}
            ></Column>
            <Column
              field="email"
              header="E-Mail"
              sortable
              style={{ width: "25%" }}
              editor={(options) => textEditor(options)}
            ></Column>
            <Column
              field="starttime"
              header="Start Date"
              sortable
              style={{ width: "25%" }}
              editor={(options) => dateEditor(options)}
            ></Column>
            <Column
              field="endtime"
              header="End Date"
              sortable
              style={{ width: "25%" }}
              editor={(options) => dateEditor(options)}
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
          <Message
            text="Right Click To Cancel A Booking"
            className="w-[300px] mr-auto"
          />
        </div>
      )}
    </>
  );
}

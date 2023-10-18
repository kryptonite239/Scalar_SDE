"use client";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRouter } from "next/navigation";
export default function Home() {
  const [rooms, setRooms] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const router = useRouter();
  useEffect(() => {
    fetch("http://localhost:3000/api/getRooms")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data.rooms);
      });
  }, []);
  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "INR",
    });
  };
  const onRowSelect = (event) => {
    router.push(`/rooms?room=${event.data._id}`);
  };
  const priceBodyTemplate = (room) => {
    return formatCurrency(room.price);
  };
  return (
    <main className="card w-full mt-10 flex items-center justify-center">
      <DataTable
        value={rooms}
        resizableColumns
        showGridlines
        stripedRows
        tableStyle={{ minWidth: "50rem" }}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        selectionMode="single"
        onSelectionChange={(e) => setSelectedProduct(e.value)}
        onRowSelect={onRowSelect}
        metaKeySelection={false}
        selection={selectedProduct}
      >
        <Column
          field="room_no"
          header="Room Number"
          sortable
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="type"
          header="Type"
          sortable
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="price"
          header="Price"
          sortable
          style={{ width: "25%" }}
          body={priceBodyTemplate}
        ></Column>
      </DataTable>
    </main>
  );
}

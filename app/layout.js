import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Hotel Booker",
  description: "Book And Manage Hotel Bookings!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="w-full h-full p-3 flex flex-col items-center justify-start">
        <Navbar />
        {children}
      </body>
    </html>
  );
}

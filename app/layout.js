import "./globals.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { PrimeReactProvider } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Hotel Booker",
  description: "Book And Manage Hotel Bookings!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="w-full h-[100vh] p-3 flex flex-col items-center">
        <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
          <Navbar />
          {children}
        </PrimeReactProvider>
      </body>
    </html>
  );
}

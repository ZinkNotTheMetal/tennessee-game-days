import { Roboto } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

const roboto = Roboto({ weight: "300", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tennessee Game Days (TGD) - Admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {children}
        {/* Documentation: */}
        {/* https://fkhadra.github.io/react-toastify/introduction/ */}
        <ToastContainer
          autoClose={6000}
          closeButton
          hideProgressBar
          position="top-right"
          style={{ width: "450px" }}
        />
      </body>
    </html>
  );
}

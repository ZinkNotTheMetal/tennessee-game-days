import { Roboto } from "next/font/google"
import "./globals.css"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"
import NavBar from "./components/navbar/navbar"
import { ClientProviders } from "./providers/client-providers"

const roboto = Roboto({ weight: "300", subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* NextAuth - Firebase (provider) */}
      <ClientProviders>
        <body className={`${roboto.className} bg-slate-200`}>
          <NavBar />
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
      </ClientProviders>
    </html>
  );
}

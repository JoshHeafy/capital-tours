import "@/public/styles/sass/style.css";
import "@/public/icons/boxicons-2.1.4/css/boxicons.min.css";
import { MyContextProvider } from "@/context/MyContext";

export const metadata = {
  title: "Capital Tours",
  description: "Capital tours admin dashboard",
  shortcut: "@/public/favicon.ico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MyContextProvider>{children}</MyContextProvider>
      </body>
    </html>
  );
}

import "@/public/styles/sass/style.css";
import "@/public/icons/boxicons-2.1.4/css/boxicons.min.css";
import { MyContextProvider } from "@/context/MyContext";

export const metadata = {
  title: "Capital Tours",
  description: "Capital tours admin dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="@/public/favicon.ico" />
      </head>
      <body>
        <MyContextProvider>{children}</MyContextProvider>
      </body>
    </html>
  );
}

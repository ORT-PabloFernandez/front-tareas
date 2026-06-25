import "./globals.css";

import HeaderNew from "./componentes/HeaderNew";
import FooterNew from "./componentes/FooterNew";

export const metadata = {
  title: "TaskFlow",
  description: "Listado y detalle de personajes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
       
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <HeaderNew />
        <main style={{ flex: 1 }}>{children}</main>
        <FooterNew />
      </body>
    </html>
  );
}

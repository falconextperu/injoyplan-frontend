
import type { Metadata } from "next";
import "./globals.css";
import { quicksand } from "../../public/fonts";
import ClientLayout from "./clienteLayout";

export const metadata: Metadata = {
  title: "Injoyplan",
  description: "Injoyplan plataforma web que necesitas para poder ver los eventos más importantes para tí",
  icons: {
    icon: '/svg/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/svg/logo.svg" />
      </head>
      <body className={`${quicksand.className}`}>
        <ClientLayout children={children} />
      </body>
      <link
        precedence="default"
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        precedence="default"
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
    </html>
  );
}
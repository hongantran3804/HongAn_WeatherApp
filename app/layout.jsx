import React from "react";
import '@styles/global.css'
export const metadata = {
  title: "Hong An WeatherApp",
};
const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="w-[100vw] h-[100vh] bg-[#CBC3E3]">
        <main className="w-full h-full border-[2px]">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;

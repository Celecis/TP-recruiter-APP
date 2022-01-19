import React, { PropsWithChildren } from "react";
import NavBar from "../../components/navBar";
import Footer from "../../components/footer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Layout = ({ children }: PropsWithChildren<any>) => {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;

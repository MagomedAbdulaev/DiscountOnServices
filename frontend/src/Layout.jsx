import React from 'react';
import Header from "./header/Header.jsx";
import {Outlet} from "react-router-dom";
import Footer from "./footer/footer.jsx";


function Layout(props) {
  return (
    <div className='wrapper'>
        <Header />
      <main className='main'>
        <Outlet />
      </main>
        <Footer />
    </div>
  );
}

export default Layout;
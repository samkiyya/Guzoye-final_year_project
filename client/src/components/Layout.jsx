import Header from "./Header";
import Routers from "./../router/Routers";
import GuzoyeBot from "../pages/user/GuzoyeBot";

import Footer from "./Footer/Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <Routers />
      <GuzoyeBot />
      <Footer />
    </>
  );
};

export default Layout;

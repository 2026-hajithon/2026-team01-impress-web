import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="max-w-107.5 min-h-dvh flex flex-col m-auto">
      <Outlet></Outlet>
    </div>
  );
};

export default Layout;

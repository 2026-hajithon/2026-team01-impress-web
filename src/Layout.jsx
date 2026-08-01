import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-dvh bg-gray-950">
      <div className="app-screen mx-auto flex min-h-dvh w-full max-w-[500px] flex-col overflow-x-hidden bg-black shadow-[0_0_36px_rgba(0,0,0,0.2)]">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

import Header from "@/components/header";
import { Outlet } from "react-router";

function Layout() {
  return (
    <div className="my-6 mx-auto w-full max-w-[1220px] flex flex-col gap-14 px-4">
      <Header /> {/* Render Header */}
      <Outlet />
    </div>
  );
}
export default Layout;

import { Outlet } from "react-router-dom";
import { useEffect } from "react";

import Appbar from "../components/Dashboard/Appbar/Appbar";
const AdminLayout = () => {
  useEffect(() => {
    document.title = "Admin Dashboard | The Works";
  }, []);

  return (
    <>
      <Appbar />
      <Outlet />
    </>
  );
};

export default AdminLayout;

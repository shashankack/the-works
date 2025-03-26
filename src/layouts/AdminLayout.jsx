import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";
import Appbar from "../components/Dashboard/Appbar/Appbar";
const AdminLayout = () => {
  return (
    <div className="admin-container" style={{ display: "flex" }}>
      <Sidebar />
      <div className="admin-content" style={{ flex: 1 }}>
        <Appbar />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

import React from "react";
import "./Sidebar.scss";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>The Works</h2>
      <nav>
        <ul>
          <li>
            <a href="/admin/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/admin/events">Manage Events</a>
          </li>
          <li>
            <a href="/admin/classes">Manage Classes</a>
          </li>
          <li>
            <a href="/admin/trainers">Manage Trainers</a>
          </li>
          <li>
            <a href="/admin/bookings">Manage Bookings</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

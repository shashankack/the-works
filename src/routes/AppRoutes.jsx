import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../components/NotFound";

import About from "../pages/AboutSection/About";
import Events from "../pages/EventsSection/Events";
import Classes from "../pages/EventsSection/Classes";

import Login from "../pages/Dashboard/Login";
import Dashboard from "../pages/Dashboard/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/about" element={<About />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/events" element={<Events />} />

      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRoutes;

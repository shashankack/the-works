import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../components/NotFound";

import About from "../pages/AboutSection/About";
import Events from "../pages/EventsSection/Events";
import Classes from "../pages/EventsSection/Classes";

import yoga from "../assets/yoga.webp";

import { dummyClasses, dummyEvents } from "../../public/dummyData";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/about" element={<About />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/events" element={<Events />} />
    </Routes>
  );
};

export default AppRoutes;

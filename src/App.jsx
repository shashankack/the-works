import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoadingScreen from "./components/Loader";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Lazy Load Pages for Performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/AboutSection/About"));
const Events = lazy(() => import("./pages/EventsSection/Events"));
const Classes = lazy(() => import("./pages/EventsSection/Classes"));
const Login = lazy(() => import("./pages/Dashboard/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const NotFound = lazy(() => import("./components/NotFound"));
const EventDetails = lazy(() => import("./pages/Dashboard/EventDetails"));
const ClassDetails = lazy(() => import("./pages/Dashboard/ClassDetails"));
const CreateEvent = lazy(() => import("./pages/Dashboard/CreateEvent.jsx"));
const CreateClass = lazy(() => import("./pages/Dashboard/CreateClass"));  

const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Normal User Routes (With Header & Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/events" element={<Events />} />
          </Route>

          {/* Admin Routes (No Header & Footer) */}
          <Route path="/admin/login" element={<Login />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/events/:id" element={<EventDetails />} />
            <Route path="/admin/classes/:id" element={<ClassDetails />} />
            <Route path="/admin/events/create" element={<CreateEvent />} />
            <Route path="/admin/classes/create" element={<CreateClass />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;

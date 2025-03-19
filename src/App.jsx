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
const DetailsInternal = lazy(() =>
  import("./pages/DetailsInternal/DetailsInternal")
);
const EditForm = lazy(() => import("./components/Dashboard/EditForm/EditForm"));

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
            <Route
              path="/admin/events/:id"
              element={<DetailsInternal isClass={false} />}
            />
            <Route
              path="/admin/events/:id/update"
              element={<EditForm isClass={false} />}
            />
            <Route
              path="/admin/classes/:id"
              element={<DetailsInternal isClass={true} />}
            />
            <Route
              path="/admin/classes/:id/update"
              element={<EditForm isClass={true} />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;

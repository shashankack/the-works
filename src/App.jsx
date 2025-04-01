import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoadingScreen from "./components/Loader";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import Bookings from "./pages/Dashboard/Bookings";

// Lazy Load Pages for Performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/AboutSection/AboutSection"));
const Login = lazy(() => import("./pages/Dashboard/login"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const NotFound = lazy(() => import("./components/NotFound"));
const Details = lazy(() => import("./pages/EventsSection/Details"));
const Trainers = lazy(() => import("./pages/Dashboard/Trainers"));
const DetailsInternal = lazy(() =>
  import("./pages/DetailsInternal/DetailsInternal")
);
const EditForm = lazy(() => import("./components/Forms/EditForm"));

const theme = createTheme({
  colors: {
    orange: "#B15324",
    beige: "#E3DED3",
    brown: "#4E2916",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />

              <Route path="/classes/:id" element={<Details isClass={true} />} />
              <Route path="/events/:id" element={<Details isClass={false} />} />
            </Route>

            <Route path="/admin/login" element={<Login />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route
                path="/admin/events/:id"
                element={<DetailsInternal isClass={false} />}
              />
              <Route path="/admin/trainers" element={<Trainers />} />
              <Route path="/admin/bookings" element={<Bookings />} />
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
    </ThemeProvider>
  );
};

export default App;

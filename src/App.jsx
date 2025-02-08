import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Testimonials from "./components/Testimonials/Testimonials";

const Home = lazy(() => import("./components/Home/Home"));
const NotFound = lazy(() => import("./components/NotFound"));

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="testimonials" element={<Testimonials />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Testimonials from "./components/Testimonials/Testimonials";

const App = () => {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="testimonials" element={<Testimonials />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;

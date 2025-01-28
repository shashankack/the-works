import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";

import Loader from "./components/Loader/Loader";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Loader loadingText="THE WORKS" nextComponent={Home} />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
};

export default App;

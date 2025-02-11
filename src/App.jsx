import { BrowserRouter as Router } from "react-router-dom";
import { Suspense, lazy } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";
import LoadingScreen from "./components/Loader";


const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Suspense fallback={<LoadingScreen />}>
          <AppRoutes />
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
};

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("./pages/home"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="text-center mt-20 text-black dark:text-white">
            Loading...
          </div>
        }
      >
        <Routes>
          {/* Default redirect to /home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

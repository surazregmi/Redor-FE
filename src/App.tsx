import { BrowserRouter as Router } from "react-router";
import { Suspense } from "react";

import AppRoutes from "./routes/AppRoutes";
import { ScrollToTop } from "./components/common/ScrollToTop";
import PageLoader from "./components/common/PageLoader";
import { ToastProvider } from "./components/toast/ToastProvider";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
      </Router>

      <ToastProvider />
    </>
  );
}

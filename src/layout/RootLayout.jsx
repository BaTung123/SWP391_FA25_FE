import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.slice(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <div>
      <Header />

      <main className="flex-1 bg-[#eaf3fb]">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default RootLayout

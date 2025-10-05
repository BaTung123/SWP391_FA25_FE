import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { Outlet } from "react-router-dom";

function RootLayout() {
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

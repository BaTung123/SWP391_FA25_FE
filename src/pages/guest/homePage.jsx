import React from "react";
// import bgGarage from "../../img/search-image.jpg";

export default function HomePage() {
  return (
    <div className="font-sans">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div
            className=" font-serif text-blue-800 font-bold text-3xl"
            style={{ fontFamily: "system-ui" }}
          >
            SCS Garage
          </div>

          {/* Menu */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 text-gray-700 font-medium">
              <li>
                <a href="#home" className="hover:text-blue-600">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-blue-600">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-600">
                  Dịch vụ
                </a>
              </li>
              <li>
                <a href="#management" className="hover:text-blue-600">
                  Quản lý
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-600">
                  Liên hệ
                </a>
              </li>
            </ul>
          </nav>

          {/* Đăng nhập */}
          <div>
            <a
              href="login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Đăng Nhập
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center text-center text-white"
      >
        Background image
        <div
          // className="absolute inset-0 bg-cover bg-center"
          // style={{
          //   backgroundImage: `url(${bgGarage})`,
          // }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">SCS Garage</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-6">
            Quản lý chuyên nghiệp
          </h2>
          <p className="text-lg mb-8">
            Hệ thống quản lý garage hiện đại cho các dòng xe điện VinFast. Theo
            dõi kho xe, dịch vụ bảo trì và quản lý hoạt động một cách hiệu quả.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="#warehouse"
              className="px-6 py-3 bg-blue-600 rounded shadow hover:bg-blue-700"
            >
              Xem kho xe
            </a>
            <a
              href="register"
              className="px-6 py-3 border border-white rounded shadow hover:bg-gray-200 hover:text-gray-900"
            >
              Đăng ký tài khoản
            </a>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:flex md:items-center">
          {/* Image */}
          <div className="md:w-1/2 mb-8 md:mb-0"></div>
          {/* Text */}
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Về chúng tôi
            </h2>
            <p className="font-bold text-lg text-gray-700 mb-4">
              Chúng tôi là một garage chuyên nghiệp trong lĩnh vực quản lý xe
              đồng sở hữu, mang đến giải pháp toàn diện cho các chủ sở hữu
              phương tiện. Với mục tiêu tối ưu chi phí, thời gian và sự thuận
              tiện, chúng tôi hỗ trợ:
            </p>
            <p className="text-lg italic text-gray-700 mt-4">
              Quản lý và theo dõi xe: thông tin chi tiết từng phương tiện, lịch
              sử vận hành và sử dụng.
            </p>
            <p className="text-lg italic text-gray-700 ">
              Đặt lịch bảo dưỡng – sửa chữa: dễ dàng lên lịch hẹn, nhắc nhở định
              kỳ để xe luôn trong tình trạng hoạt động tốt nhất.
            </p>
            <p className="text-lg italic text-gray-700 ">
              Quản lý chi phí minh bạch: theo dõi các khoản chi liên quan đến
              xăng dầu, bảo dưỡng, bảo hiểm và các chi phí khác.
            </p>
            <p className="text-lg italic text-gray-700 mb-4">
              Hỗ trợ chủ sở hữu: tạo sự yên tâm, đảm bảo xe được chăm sóc đúng
              tiêu chuẩn, giảm thiểu rủi ro và nâng cao tuổi thọ phương tiện.
            </p>
            <p className="font-bold text-lg text-gray-700 mb-4">
              Với kinh nghiệm, sự tận tâm và hệ thống quản lý hiện đại, chúng
              tôi cam kết đồng hành cùng các chủ sở hữu trong việc khai thác và
              sử dụng xe hiệu quả, an toàn và tiết kiệm.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo + Intro */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">SCS Garage</h3>
            <p>
              Giải pháp quản lý garage hiện đại, tối ưu vận hành cho các dòng xe
              điện VinFast.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="hover:text-white">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white">
                  Dịch vụ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <section id="contact">
            <div>
              <h4 className="font-semibold text-white mb-4">Liên hệ</h4>
              <ul className="space-y-2">
                <li>Email: support@scsgarage.com</li>
                <li>Điện thoại: +84 123 456 789</li>
                <li>Địa chỉ: Quận 1, TP. Hồ Chí Minh</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="text-center text-gray-500 mt-8 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} SCS Garage. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

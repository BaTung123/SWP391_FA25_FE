import React from "react";
import bgGarage from "../../assets/search-image.jpg";
import logoGarage from "../../assets/logo.png";
import image from "../../assets/work.png";
import vision from "../../assets/vision.png";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Card, Typography } from "antd";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const { Title, Text } = Typography;

// ===== EV BRANDS =====
const BRAND_FALLBACK =
  "https://images.unsplash.com/photo-1619767886558-efdc259cde1b?q=80&w=1600&auto=format&fit=crop";

const BRANDS = [
  {
    name: "VinFast",
    country: "VN",
    img: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw6dac8f1c/images/vfast/Hinh-anh-xe-SUV-VinFast-President-gia-xe-thong-so-bang-mau-dong-co-v8.jpg",
  },
  {
    name: "BYD",
    country: "CN",
    img: "https://bydvn.com.vn/Content/Uploads/Articles/HAN/BYD-HAN-avt-grey.png",
  },
  {
    name: "Tesla",
    country: "US",
    img: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1600&auto=format&fit=crop",
  },
  {
    name: "Hyundai",
    country: "KR",
    img: "https://www.kedglobal.com/data/ked/image/2021/01/08/ked202101080025.680x.0.jpg",
  },
  {
    name: "Kia",
    country: "KR",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBmzVDMKfx8tAKZOFtwig37_zt78z2vDN-Lg&s",
  },
  {
    name: "Mercedes-EQ",
    country: "DE",
    img: "https://www.winauto.vn/wp-content/uploads/2021/10/he-thong-sac-xe-mercedes-eqs-2022-muaxegiatot-vn.jpg",
  },
];

const BrandCard = ({ item }) => (
  <div className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white">
    <div className="h-44 sm:h-52 md:h-56 w-full relative">
      <img
        src={item.img}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => (e.currentTarget.src = BRAND_FALLBACK)}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div>
          <div className="text-white font-bold text-lg leading-none drop-shadow">
            {item.name}
          </div>
          <div className="text-white/80 text-xs mt-0.5">{item.country}</div>
        </div>
      </div>
    </div>
  </div>
);

export default function HomePage() {
  return (
    <div className="font-sans min-h-screen">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .car-swiper .swiper-button-prev,
          .car-swiper .swiper-button-next {
            position: absolute !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            z-index: 10 !important;
            width: 36px !important;
            height: 36px !important;
            margin-top: 0 !important;
            background-color: rgba(255, 255, 255, 0.9) !important;
            border-radius: 50% !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
            transition: all 0.3s ease !important;
          }
          .car-swiper .swiper-button-prev { left: -18px !important; }
          .car-swiper .swiper-button-next { right: -18px !important; }
          .car-swiper .swiper-button-prev:hover,
          .car-swiper .swiper-button-next:hover {
            background-color: #2563eb !important;
            color: white !important;
            transform: translateY(-50%) scale(1.1) !important;
          }
          .car-swiper .swiper-button-prev:after,
          .car-swiper .swiper-button-next:after {
            font-size: 14px !important;
            font-weight: bold !important;
          }
          .car-swiper .swiper-pagination {
            position: relative !important;
            margin-top: 32px !important;
            text-align: center !important;
          }
          .car-swiper .swiper-pagination-bullet {
            background-color: #2563eb !important;
            opacity: 0.3 !important;
          }
          .car-swiper .swiper-pagination-bullet-active { opacity: 1 !important; }
        `,
        }}
      />
      <Header />

      {/* HERO */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center text-center text-white bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url('https://images.unsplash.com/photo-1619767886558-efdc259cde1b?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgGarage})` }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">EV Co-ownership</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-6">
            Chia sẻ chi phí, tối đa giá trị sử dụng
          </h2>
          <p className="text-lg mb-8">
            Cùng góp vốn sở hữu xe điện, đặt lịch dùng xe thông minh và chia sẻ
            chi phí minh bạch. Nền tảng quản trị nhóm giúp theo dõi kWh, bảo trì,
            ngân sách và báo cáo theo thời gian thực.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="warehouse"
              className="px-6 py-3 bg-blue-600 rounded shadow hover:bg-blue-700"
            >
              Khám phá xe dùng chung
            </a>
          </div>
        </div>
      </section>

      {/* WAREHOUSE PREVIEW + BRANDS */}
      <section id="warehouse" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Danh mục EV cho đồng sở hữu
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Xem các mẫu EV phù hợp với nhu cầu nhóm, phạm vi di chuyển, hiệu năng và chi phí vận hành.
            </p>
          </div>

          {/* EV Brands – Các hãng EV tiêu biểu */}
          <section className="mt-2">
  

            {/* Grid desktop */}
            <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {BRANDS.map((b) => (
                <BrandCard key={b.name} item={b} />
              ))}
            </div>

            {/* Swiper mobile */}
            <div className="sm:hidden px-2">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                slidesPerView={1.15}
                spaceBetween={12}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3500 }}
                className="pb-8"
              >
                {BRANDS.map((b) => (
                  <SwiperSlide key={b.name}>
                    <BrandCard item={b} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>

          {/* Car Cards Slider (giữ nguyên của bạn) */}
          {/* <section className="py-20 bg-gray-50">
            <div className="text-center mb-12">
              <Text type="secondary">
                Choose from our selection of top-rated vehicles for your next trip
              </Text>
            </div>

            <div className="px-6">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                slidesPerView={1}
                spaceBetween={20}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000 }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="pb-10"
              >
                {[
                  {
                    name: "VinFast VF3",
                    img: "https://i1-vnexpress.vnecdn.net/2024/08/01/VinFastVF3VnE9416JPG-1722500133.jpg?w=750&h=450&q=100&dpr=1&fit=crop&s=PqtpkmPPpczSND540feRFg",
                  },
                  {
                    name: "VinFast VF5",
                    img: "https://tse3.mm.bing.net/th/id/OIP.Wwv2jLcoiXO9YXN4QTNY4gHaFR?pid=Api&P=0&h=220",
                  },
                  {
                    name: "VinFast VF6",
                    img: "https://tse1.mm.bing.net/th/id/OIP.xRVbVRcFbXGKDLNfUz5_6wHaE7?pid=Api&P=0&h=220",
                  },
                  {
                    name: "VinFast VF7",
                    img: "https://tse3.mm.bing.net/th/id/OIP.BTN06ECSn6134CVkuZwklwHaEK?pid=Api&P=0&h=220",
                  },
                  {
                    name: "VinFast VF8",
                    img: "https://tse3.mm.bing.net/th/id/OIP.yu-rxYqPXlkF3lAdYNPp-QHaEK?pid=Api&P=0&h=220",
                  },
                ].map((car, i) => (
                  <SwiperSlide key={i}>
                    <Card
                      hoverable
                      cover={
                        <div className="h-64 sm:h-72 md:h-80 lg:h-96 w-full relative rounded-t-xl overflow-hidden bg-gray-50">
                          <img
                            alt={car.name}
                            src={car.img}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      }
                      className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-4 text-center">
                        <Title level={4} className="text-gray-800 mb-1">
                          {car.name}
                        </Title>
                      </div>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section> */}
        </div>
      </section>

      {/* MANAGEMENT FEATURES */}
      <section id="management" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Tính năng cho nhóm đồng sở hữu
            </h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            role="grid"
            aria-label="Tính năng EV Co-ownership"
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quản lý phương tiện</h3>
              <p className="text-gray-600">
                Theo dõi EV, lịch sử sử dụng, tình trạng pin và phân quyền người dùng trong nhóm.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Lịch bảo trì & sạc</h3>
              <p className="text-gray-600">
                Đặt lịch bảo dưỡng, theo dõi chu kỳ sạc, cảnh báo pin và nhắc nhở tự động.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Báo cáo & sổ cái</h3>
              <p className="text-gray-600">
                Theo dõi chi phí theo thời gian thực, chia sẻ minh bạch theo tỉ lệ sở hữu và suất dùng.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quản lý thành viên</h3>
              <p className="text-gray-600">
                Phân quyền, quy tắc ưu tiên đặt lịch và giải quyết xung đột minh bạch.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Thông báo thông minh</h3>
              <p className="text-gray-600">
                Cảnh báo xung đột lịch, vượt ngân sách, lịch sạc và nhắc nhở bảo trì.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Lưu trữ & đồng bộ</h3>
              <p className="text-gray-600">
                Dữ liệu nhóm được mã hóa, đồng bộ an toàn, truy cập mọi thiết bị.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD TEASER */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Dashboard background"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Bảng điều khiển đồng sở hữu</h2>
            <p className="text-lg mb-12 max-w-4xl mx-auto">
              Theo dõi lịch đặt, chi phí, kWh tiêu thụ và hiệu suất sử dụng theo thời gian thực, tất cả trong một nơi.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-lg">Giám sát & đặt lịch</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-lg">Thời gian hệ thống hoạt động</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">1-click</div>
                <div className="text-lg">Chia sẻ chi phí minh bạch</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT – Platform */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:flex md:items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="relative">
              <img
                src={logoGarage}
                alt="EV Co-ownership Platform"
                className="w-full h-96 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-opacity-20 rounded-lg"></div>
            </div>
          </div>

          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Nền tảng đồng sở hữu xe điện (EV)
            </h2>
            <p className="font-bold text-lg text-gray-700 mb-4">
              EV Co-ownership là giải pháp giúp cộng đồng cùng sở hữu, sử dụng và quản lý xe điện một cách tiện lợi, minh bạch và tiết kiệm chi phí.
            </p>
            <p className="text-lg italic text-gray-700 mt-4">
              Kết nối các thành viên có chung nhu cầu – từ việc góp vốn, đặt lịch sử dụng cho đến theo dõi bảo trì, chi phí, và lịch sử vận hành.
            </p>
            <p className="font-bold text-lg text-gray-700 mt-4">
              Giúp nhóm của bạn khai thác tối đa giá trị EV, giảm chi phí sở hữu, đồng thời góp phần thúc đẩy giao thông xanh bền vững.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6 md:flex md:items-center">
          <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Cách nền tảng hoạt động</h2>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold">1. Góp vốn cùng nhau:</span> các thành viên đăng ký và chia sẻ chi phí đầu tư xe điện theo tỉ lệ sở hữu.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold">2. Đặt lịch linh hoạt:</span> hệ thống hỗ trợ đặt lịch dùng xe, hoán đổi suất và cảnh báo trùng lịch tự động.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold">3. Chia sẻ chi phí minh bạch:</span> bảng sổ cái tự động ghi nhận điện năng tiêu thụ, phí bảo trì và chia theo tỷ lệ thực tế.
            </p>
            <p className="font-bold text-lg text-gray-700">
              Mọi dữ liệu được lưu trữ an toàn và có thể theo dõi theo thời gian thực.
            </p>
          </div>

          <div className="md:w-1/2">
            <div className="relative">
              <img
                src={image}
                alt="How EV Co-ownership Works"
                className="w-full h-96 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-opacity-20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section id="vision" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:flex md:items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="relative">
              <img
                src={vision}
                alt="EV Co-ownership Vision"
                className="w-full h-96 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-opacity-20 rounded-lg"></div>
            </div>
          </div>

          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Tầm nhìn & Sứ mệnh</h2>
            <p className="font-bold text-lg text-gray-700 mb-4">
              Chúng tôi tin rằng việc đồng sở hữu EV không chỉ là cách chia sẻ tài sản, mà còn là cách lan tỏa ý thức sống xanh và thông minh.
            </p>
            <p className="text-lg italic text-gray-700 mb-4">
              Mục tiêu của chúng tôi là xây dựng cộng đồng bền vững, nơi mọi người đều có thể tiếp cận xe điện dễ dàng, tiết kiệm và thân thiện với môi trường.
            </p>
            <p className="font-bold text-lg text-gray-700">
              EV Co-ownership hướng tới tương lai – nơi mọi hành trình đều gắn liền với công nghệ, sự tin cậy và giá trị chia sẻ.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

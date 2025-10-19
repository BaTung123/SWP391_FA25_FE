import React from "react";
import bgGarage from "../../assets/search-image.jpg";
import logoGarage from "../../assets/logo.png";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HomePage() {
  return (
    <div className="font-sans min-h-screen">
      <style dangerouslySetInnerHTML={{
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
          .car-swiper .swiper-button-prev {
            left: -18px !important;
          }
          .car-swiper .swiper-button-next {
            right: -18px !important;
          }
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
          .car-swiper .swiper-pagination-bullet-active {
            opacity: 1 !important;
          }
        `
      }} />
      <Header />
      <section
        id="home"
        className="relative h-screen flex items-center justify-center text-center text-white bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('https://images.unsplash.com/photo-1619767886558-efdc259cde1b?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgGarage})`,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            EV Co‑ownership
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-6">
            Chia sẻ chi phí, tối đa giá trị sử dụng
          </h2>
          <p className="text-lg mb-8">
            Cùng góp vốn sở hữu xe điện, đặt lịch dùng xe thông minh và chia sẻ
            chi phí minh bạch. Nền tảng quản trị nhóm giúp theo dõi kWh, bảo
            trì, ngân sách và báo cáo theo thời gian thực.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="#warehouse"
              className="px-6 py-3 bg-blue-600 rounded shadow hover:bg-blue-700"
            >
              Khám phá xe dùng chung
            </a>
          </div>
        </div>
      </section>

      {/* Car Inventory Section */}
      <section id="warehouse" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Danh mục EV cho đồng sở hữu
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Xem các mẫu EV phù hợp với nhu cầu nhóm, phạm vi di chuyển, hiệu
              năng và chi phí vận hành.
            </p>
          </div>

          {/* Car Cards Slider */}
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              centeredSlides={true}
              loop={true}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination',
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                  centeredSlides: true,
                },
                1024: {
                  slidesPerView: 1,
                  spaceBetween: 30,
                  centeredSlides: true,
                },
              }}
              className="car-swiper"
            >
              {/* VF 3 Card */}
              <SwiperSlide>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 h-full">
                  <div className="p-6 h-full flex flex-col">
                {/* Car Image */}
                <div className="w-full h-170 rounded-lg mb-4 overflow-hidden">
                  <img
                    src="https://i1-vnexpress.vnecdn.net/2024/08/01/VinFastVF3VnE9416JPG-1722500133.jpg?w=750&h=450&q=100&dpr=1&fit=crop&s=PqtpkmPPpczSND540feRFg"
                    alt="VF 3 - City EV"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Model */}
                <h3 className="text-2xl font-bold text-gray-800 mb-1">VF 3</h3>
                <p className="text-gray-600 mb-4">Phù hợp 2–4 đồng sở hữu</p>

                {/* Specifications */}
                    <div className="grid grid-cols-2 gap-3 mb-4 flex-grow">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                    </svg>
                    <span className="text-sm">210 km/phút sạc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">43 HP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">0–100 km/h: 16.0s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-sm">4 chỗ</span>
                  </div>
                </div>
              </div>
            </div>
              </SwiperSlide>

            {/* VF 5 Card */}
              <SwiperSlide>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 h-full">
                  <div className="p-6 h-full flex flex-col">
                {/* Car Image */}
                <div className="w-full h-170 rounded-lg mb-4 overflow-hidden">
                  <img
                    src="https://drive.gianhangvn.com/image/vf-5-2684882j29551.jpg"
                    alt="VF 5 - Hatchback EV"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Model */}
                <h3 className="text-2xl font-bold text-gray-800 mb-1">VF 5</h3>
                <p className="text-gray-600 mb-4">
                  Phù hợp 3–6 đồng sở hữu
                </p>

                {/* Specifications */}
                    <div className="grid grid-cols-2 gap-3 mb-4 flex-grow">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                    </svg>
                    <span className="text-sm">285 km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">134 HP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">0–100 km/h: 9.8s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-sm">5 chỗ</span>
                  </div>
                </div>
              </div>
            </div>
              </SwiperSlide>

              {/* VF 6 Card */}
              <SwiperSlide>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 h-full">
                  <div className="p-6 h-full flex flex-col">
                    {/* Car Image */}
                    <div className="w-full h-170 rounded-lg mb-4 overflow-hidden">
                      <img
                        src="https://vinfastquangninh.com.vn/wp-content/uploads/2023/10/z5563076680315_20cc2d1649bda452c85db3f1af42a2b2-min.jpg"
                        alt="VF 6 - SUV Compact EV"
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Model */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">VF 6</h3>
                    <p className="text-gray-600 mb-4">
                      Phù hợp 5–7 đồng sở hữu
                    </p>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 gap-3 mb-4 flex-grow">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                        </svg>
                        <span className="text-sm">388 km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">177 HP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">0–100 km/h: 8.9s</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span className="text-sm">5 chỗ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              {/* VF 8 Card */}
              <SwiperSlide>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 h-full">
                  <div className="p-6 h-full flex flex-col">
                    {/* Car Image */}
                    <div className="w-full h-170 rounded-lg mb-4 overflow-hidden">
                      <img
                        src="https://i-vnexpress.vnecdn.net/2022/11/03/DSC-4710-JPG-4434-1667458940.jpg"
                        alt="VF 8 - Luxury SUV EV"
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Model */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">VF 8</h3>
                    <p className="text-gray-600 mb-4">
                      Phù hợp 6–8 đồng sở hữu
                    </p>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 gap-3 mb-4 flex-grow">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                        </svg>
                        <span className="text-sm">520 km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">245 HP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">0–100 km/h: 6.2s</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span className="text-sm">7 chỗ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              {/* VF 9 Card */}
              <SwiperSlide>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 h-full">
                  <div className="p-6 h-full flex flex-col">
                    {/* Car Image */}
                    <div className="w-full h-170 rounded-lg mb-4 overflow-hidden">
                      <img
                        src="https://i1-vnexpress.vnecdn.net/2023/03/27/VF9thumjpg-1679907708.jpg?w=750&h=450&q=100&dpr=1&fit=crop&s=Swpqo7PubMKfM8H_JnC3Pw"
                        alt="VF 9 - Premium Sedan EV"
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Model */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">VF 9</h3>
                    <p className="text-gray-600 mb-4">
                      Phù hợp 4–6 đồng sở hữu
                    </p>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 gap-3 mb-4 flex-grow">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                        </svg>
                        <span className="text-sm">650 km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">320 HP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">0–100 km/h: 4.8s</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span className="text-sm">5 chỗ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>

            {/* Navigation Buttons */}
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
            
            {/* Pagination */}
            <div className="swiper-pagination" style={{
              position: 'relative',
              marginTop: '32px',
              textAlign: 'center'
            }}></div>
          </div>
        </div>
      </section>

      {/* Management Features Section */}
      <section id="management" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Tính năng cho nhóm đồng sở hữu
            </h2>
          </div>

          {/* Features Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            role="grid"
            aria-label="Tính năng EV Co-ownership"
          >
            {/* Feature 1: Vehicle Inventory Management */}
            <div
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              role="gridcell"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Quản lý phương tiện
              </h3>
              <p className="text-gray-600">
                Theo dõi EV, lịch sử sử dụng, tình trạng pin và phân quyền người
                dùng trong nhóm.
              </p>
            </div>

            {/* Feature 2: Maintenance Schedule */}
            <div
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              role="gridcell"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Lịch bảo trì & sạc
              </h3>
              <p className="text-gray-600">
                Đặt lịch bảo dưỡng, theo dõi chu kỳ sạc, cảnh báo pin và nhắc
                nhở tự động.
              </p>
            </div>

            {/* Feature 3: Statistical Reports */}
            <div
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              role="gridcell"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Báo cáo & sổ cái
              </h3>
              <p className="text-gray-600">
                Theo dõi chi phí theo thời gian thực, chia sẻ minh bạch theo tỉ
                lệ sở hữu và suất dùng.
              </p>
            </div>

            {/* Feature 4: Staff Management */}
            <div
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              role="gridcell"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Quản lý thành viên
              </h3>
              <p className="text-gray-600">
                Phân quyền, quy tắc ưu tiên đặt lịch và giải quyết xung đột minh
                bạch.
              </p>
            </div>

            {/* Feature 5: Automatic Notifications */}
            <div
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              role="gridcell"
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Thông báo thông minh
              </h3>
              <p className="text-gray-600">
                Cảnh báo xung đột lịch, vượt ngân sách, lịch sạc và nhắc nhở bảo
                trì.
              </p>
            </div>

            {/* Feature 6: Cloud Storage */}
            <div
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              role="gridcell"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Lưu trữ & đồng bộ
              </h3>
              <p className="text-gray-600">
                Dữ liệu nhóm được mã hóa, đồng bộ an toàn, truy cập mọi thiết
                bị.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Management Dashboard Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        {/* Background Pattern */}
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
            {/* Header */}
            <h2 className="text-4xl font-bold mb-6">
              Bảng điều khiển đồng sở hữu
            </h2>
            <p className="text-lg mb-12 max-w-4xl mx-auto">
              Theo dõi lịch đặt, chi phí, kWh tiêu thụ và hiệu suất sử dụng theo
              thời gian thực, tất cả trong một nơi.
            </p>

            {/* Key Metrics */}
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

{/* About Us – Giới thiệu Nền tảng */}
<section id="about" className="py-20 bg-gray-50">
  <div className="container mx-auto px-6 md:flex md:items-center">
    {/* Image */}
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

    {/* Text */}
    <div className="md:w-1/2 md:pl-12">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Nền tảng đồng sở hữu xe điện (EV)
      </h2>
      <p className="font-bold text-lg text-gray-700 mb-4">
        EV Co-ownership là giải pháp giúp cộng đồng cùng sở hữu, sử dụng và
        quản lý xe điện một cách tiện lợi, minh bạch và tiết kiệm chi phí.
      </p>
      <p className="text-lg italic text-gray-700 mt-4">
        Kết nối các thành viên có chung nhu cầu – từ việc góp vốn, đặt lịch
        sử dụng cho đến theo dõi bảo trì, chi phí, và lịch sử vận hành.
      </p>
      <p className="font-bold text-lg text-gray-700 mt-4">
        Giúp nhóm của bạn khai thác tối đa giá trị EV, giảm chi phí sở hữu,
        đồng thời góp phần thúc đẩy giao thông xanh bền vững.
      </p>
    </div>
  </div>
</section>


      {/* About Us – Cách Hoạt Động */}
<section id="how-it-works" className="py-20 bg-white">
  <div className="container mx-auto px-6 md:flex md:items-center">
    {/* Text */}
    <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Cách nền tảng hoạt động
      </h2>
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

    {/* Image */}
    <div className="md:w-1/2">
      <div className="relative">
        <img
          src={logoGarage}
          alt="How EV Co-ownership Works"
          className="w-full h-96 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-opacity-20 rounded-lg"></div>
      </div>
    </div>
  </div>
</section>

{/* About Us – Tầm Nhìn & Sứ Mệnh */}
<section id="vision" className="py-20 bg-gray-50">
  <div className="container mx-auto px-6 md:flex md:items-center">
    {/* Image */}
    <div className="md:w-1/2 mb-8 md:mb-0">
      <div className="relative">
        <img
          src={logoGarage}
          alt="EV Co-ownership Vision"
          className="w-full h-96 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-opacity-20 rounded-lg"></div>
      </div>
    </div>

    {/* Text */}
    <div className="md:w-1/2 md:pl-12">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Tầm nhìn & Sứ mệnh
      </h2>
      <p className="font-bold text-lg text-gray-700 mb-4">
        Chúng tôi tin rằng việc đồng sở hữu EV không chỉ là cách chia sẻ tài
        sản, mà còn là cách lan tỏa ý thức sống xanh và thông minh.
      </p>
      <p className="text-lg italic text-gray-700 mb-4">
        Mục tiêu của chúng tôi là xây dựng cộng đồng bền vững, nơi mọi người
        đều có thể tiếp cận xe điện dễ dàng, tiết kiệm và thân thiện với môi trường.
      </p>
      <p className="font-bold text-lg text-gray-700">
        EV Co-ownership hướng tới tương lai – nơi mọi hành trình đều gắn liền
        với công nghệ, sự tin cậy và giá trị chia sẻ.
      </p>
    </div>
  </div>
</section>

      <Footer />
    </div>
  );
}

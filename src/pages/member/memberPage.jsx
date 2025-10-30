import React from "react";
import bgGarage from "../../assets/search-image.jpg";
import Footer from "../../components/footer/footer";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Card, Typography } from "antd";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const { Title, Text } = Typography;

export default function MemberPage() {
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
            width: 40px !important;
            height: 40px !important;
            margin-top: 0 !important;
            background-color: rgba(255, 255, 255, 0.9) !important;
            border-radius: 50% !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
            transition: all 0.3s ease !important;
          }
          .car-swiper .swiper-button-prev { left: 10px !important; }
          .car-swiper .swiper-button-next { right: 10px !important; }
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

      {/* Header cho member (đã có nút Thông tin cá nhân + Logout) */}
      <MemberHeader />

      <section
        id="home"
        className="relative h-screen flex items-center justify-center text-center text-white bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('https://images.unsplash.com/photo-1619767886558-efdc259cde1b?q=80&w=2070&auto=format&fit=crop')",
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
            Cùng góp vốn sở hữu xe điện, đặt lịch dùng xe thông minh và chia sẻ chi phí
            minh bạch. Nền tảng quản trị nhóm giúp theo dõi kWh, bảo trì, ngân sách và
            báo cáo theo thời gian thực.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#warehouse" className="px-6 py-3 bg-blue-600 rounded shadow hover:bg-blue-700">
              Khám phá xe dùng chung
            </a>
          </div>
        </div>
      </section>

      {/* Car Inventory Section */}
      <section id="warehouse" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Danh mục EV cho đồng sở hữu
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Xem các mẫu EV phù hợp với nhu cầu nhóm, phạm vi di chuyển, hiệu năng và
              chi phí vận hành.
            </p>
          </div>

          <section className="py-20 bg-gray-50">
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
                className="pb-10 car-swiper"
              >
                {[
                  {
                    name: "VinFast VF3",
                    //price: "$180 / day",
                    img: "https://i1-vnexpress.vnecdn.net/2024/08/01/VinFastVF3VnE9416JPG-1722500133.jpg?w=750&h=450&q=100&dpr=1&fit=crop&s=PqtpkmPPpczSND540feRFg",
                  },
                  {
                    name: "Vinfast VF5",
                    //price: "$150 / day",
                    img: "https://tse3.mm.bing.net/th/id/OIP.Wwv2jLcoiXO9YXN4QTNY4gHaFR?pid=Api&P=0&h=220",
                  },
                  {
                    name: "Vinfast VF6",
                    //price: "$120 / day",
                    img: "https://tse1.mm.bing.net/th/id/OIP.xRVbVRcFbXGKDLNfUz5_6wHaE7?pid=Api&P=0&h=220",
                  },
                  {
                    name: "Vinfast VF7",
                    //price: "$200 / day",
                    img: "https://tse3.mm.bing.net/th/id/OIP.BTN06ECSn6134CVkuZwklwHaEK?pid=Api&P=0&h=220",
                  },
                  {
                    name: "Vinfast VF8",
                    //price: "$130 / day",
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
                        <Text className="text-blue-600 font-semibold">
                          {car.price}
                        </Text>
                      </div>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        </div>
      </section>

      {/* Member Dashboard Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Bảng Điều Khiển Thành Viên
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Booking Status */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Lịch Đặt Xe</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Đang chờ duyệt:</span>
                  <span className="font-semibold text-orange-500">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Đã xác nhận:</span>
                  <span className="font-semibold text-green-500">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sắp tới:</span>
                  <span className="font-semibold text-blue-500">3</span>
                </div>
              </div>
              <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Xem Chi Tiết
              </button>
            </div>

            {/* Usage Statistics */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Thống Kê Sử Dụng</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Tổng giờ sử dụng:</span>
                  <span className="font-semibold">48 giờ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Quãng đường:</span>
                  <span className="font-semibold">789 km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Điện năng tiêu thụ:</span>
                  <span className="font-semibold">180 kWh</span>
                </div>
              </div>
              <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Xem Báo Cáo
              </button>
            </div>

            {/* Payment Summary */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Tổng Kết Chi Phí</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Chi phí sạc:</span>
                  <span className="font-semibold">540,000 đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Chi phí bảo trì:</span>
                  <span className="font-semibold">320,000 đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tổng cộng:</span>
                  <span className="font-semibold text-blue-600">860,000 đ</span>
                </div>
              </div>
              <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Thanh Toán Ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Thao Tác Nhanh
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <button className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center">
              <svg className="w-8 h-8 mx-auto mb-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">Đặt Lịch</span>
            </button>
            
            <button className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center">
              <svg className="w-8 h-8 mx-auto mb-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Nạp Tiền</span>
            </button>
            
            <button className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center">
              <svg className="w-8 h-8 mx-auto mb-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-semibold">Lịch Sử</span>
            </button>
            
            <button className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center">
              <svg className="w-8 h-8 mx-auto mb-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Hỗ Trợ</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

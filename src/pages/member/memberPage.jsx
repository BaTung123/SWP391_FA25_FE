import React from "react";
import bgGarage from "../../assets/search-image.jpg";
import MemberHeader from "../../components/header/memberheader"; 
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
                    price: "$180 / day",
                    img: "https://i1-vnexpress.vnecdn.net/2024/08/01/VinFastVF3VnE9416JPG-1722500133.jpg?w=750&h=450&q=100&dpr=1&fit=crop&s=PqtpkmPPpczSND540feRFg",
                  },
                  {
                    name: "Toyota Alphard",
                    price: "$150 / day",
                    img: "https://images.unsplash.com/photo-1605559424843-94d89b7a612d?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Ford Transit Limousine",
                    price: "$120 / day",
                    img: "https://images.unsplash.com/photo-1583267747406-1c1c62666b03?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Lexus LM 350h",
                    price: "$200 / day",
                    img: "https://images.unsplash.com/photo-1598133894008-cd9f22e0e4e4?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    name: "Hyundai Solati VIP",
                    price: "$130 / day",
                    img: "https://images.unsplash.com/photo-1611472173361-c59f0a73084c?auto=format&fit=crop&w=800&q=80",
                  },
                ].map((car, i) => (
                  <SwiperSlide key={i}>
                    <Card
                      hoverable
                      cover={
                        <div className="h-72 sm:h-80 md:h-96 lg:h-[420px] w-full flex items-center justify-center bg-gray-50 rounded-t-xl overflow-hidden">
                          <img
                            alt={car.name}
                            src={car.img}
                            className="max-h-full max-w-full object-contain"
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
          </section>
        </div>
      </section>

      <Footer />
    </div>
  );
}

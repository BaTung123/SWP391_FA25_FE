import React from "react";
// import logoGarage from "../../assets/logo.png";
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Hero */}
      <section className="pt-28 pb-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Đồng Sở Hữu Ô Tô Điện và Hệ Thống Chia Sẻ Chi Phí
          </h1>
          <p className="mt-2 text-gray-600">
            Mô hình cùng sở hữu EV, tối ưu chi phí – tối đa trải nghiệm
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1619767886558-efdc259cde1b?q=80&w=1920&auto=format&fit=crop"
              alt="Xe điện và người dùng"
              className="w-full h-64 sm:h-80 md:h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-6">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="prose prose-indigo max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Hệ thống Đồng Sở Hữu Ô Tô Điện (EV Co-ownership) cho phép nhiều
              người cùng góp vốn sở hữu một chiếc EV, sử dụng lịch đặt xe thông
              minh và cơ chế chia sẻ chi phí minh bạch. Mô hình này giúp giảm
              rào cản chi phí ban đầu, tăng hiệu suất khai thác phương tiện và
              thúc đẩy chuyển dịch xanh trong giao thông đô thị.
            </p>

            <p className="text-gray-700 leading-relaxed mt-4">
              Nền tảng của chúng tôi cung cấp quản lý quyền sở hữu theo tỷ lệ,
              định mức sử dụng, theo dõi chi phí (sạc, bảo trì, bãi đỗ), cùng bộ
              quy tắc công bằng để giải quyết xung đột. Tất cả đều được số hóa:
              hợp đồng, lịch đặt, thanh toán và báo cáo.
            </p>

            {/* Quote */}
            <div className="mt-8 border-l-4 border-indigo-500 pl-6">
              <p className="text-lg italic text-gray-900">
                "Sở hữu xe điện trở nên khả thi hơn khi chúng ta cùng chia sẻ
                trách nhiệm và lợi ích."
              </p>
              <p className="mt-2 text-sm text-gray-500">
                — Tuyên ngôn sản phẩm EV Co-ownership
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mt-8">
              Thuật toán phân bổ suất sử dụng dựa trên tỉ lệ sở hữu, ưu tiên
              theo bối cảnh (giờ cao điểm, ngày lễ), và khả năng hoán đổi giữa
              các đồng sở hữu. Mọi phát sinh đều được phản ánh ngay vào sổ cái
              chi phí và ví nhóm.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1617814071462-c3a4b39f0a9c?q=80&w=1680&auto=format&fit=crop"
                alt="Sạc xe điện và bảng điều khiển"
                className="w-full h-56 sm:h-72 md:h-[360px] object-cover"
              />
            </div>

            <p className="text-gray-700 leading-relaxed mt-8">
              Minh bạch là cốt lõi: bảng điều khiển hiển thị chi tiết từng
              chuyến đi, kWh tiêu thụ, phí sạc, bảo trì định kỳ và phân chia chi
              phí theo thời gian thực. Chủ nhóm có thể đặt ngưỡng ngân sách,
              nhận cảnh báo và xuất báo cáo theo tháng/quý.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Post */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Chủ đề nổi bật
            </h2>
            <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-500 transition">
              Xem tất cả
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <article className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <img
                src="https://images.unsplash.com/photo-1601924582971-b2225d4df5d3?q=80&w=1200&auto=format&fit=crop"
                alt="Mô hình chia sẻ chi phí"
                className="h-40 w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700">
                    Chiến lược
                  </span>
                  <span>12 phút trước</span>
                </div>
                <h3 className="mt-3 font-semibold text-gray-900 line-clamp-2">
                  Thiết kế công thức chia sẻ chi phí công bằng cho EV
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  Cân bằng giữa tỉ lệ sở hữu, thời lượng sử dụng, và chi phí bảo
                  trì thực tế.
                </p>
                <a
                  className="mt-3 inline-block text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                  href="#"
                >
                  Đọc tiếp…
                </a>
              </div>
            </article>

            {/* Card 2 */}
            <article className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <img
                src="https://images.unsplash.com/photo-1600359754536-83aacb0f3021?q=80&w=1200&auto=format&fit=crop"
                alt="Lập lịch dùng xe"
                className="h-40 w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="px-2 py-1 rounded-md bg-rose-50 text-rose-700">
                    Vận hành
                  </span>
                  <span>2 giờ trước</span>
                </div>
                <h3 className="mt-3 font-semibold text-gray-900 line-clamp-2">
                  Lập lịch và ưu tiên đặt chỗ trong nhóm đồng sở hữu
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  Nguyên tắc công bằng, tránh xung đột, và cách hoán đổi suất sử
                  dụng.
                </p>
                <a
                  className="mt-3 inline-block text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                  href="#"
                >
                  Đọc tiếp…
                </a>
              </div>
            </article>

            {/* Card 3 */}
            <article className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <img
                src="https://images.unsplash.com/photo-1617814065530-045d65ee03e6?q=80&w=1200&auto=format&fit=crop"
                alt="Sạc nhanh và chi phí"
                className="h-40 w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700">
                    Kỹ thuật
                  </span>
                  <span>Hôm qua</span>
                </div>
                <h3 className="mt-3 font-semibold text-gray-900 line-clamp-2">
                  Theo dõi kWh, tối ưu chi phí sạc và bảo trì
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  Bộ chỉ số quan trọng giúp nhóm đưa ra quyết định chính xác
                  theo thời gian thực.
                </p>
                <a
                  className="mt-3 inline-block text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                  href="#"
                >
                  Đọc tiếp…
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

import React from 'react';
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900">Liên Hệ — EV Co-ownership & Cost-sharing</h2>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: info */}
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Chúng Tôi Sẵn Sàng Hỗ Trợ</h3>
                <p className="mt-1 text-sm text-gray-600">Trao đổi về mô hình đồng sở hữu xe điện, cách chia sẻ chi phí, và giải pháp cho nhóm của bạn.</p>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-3"><i className="fa-solid fa-location-dot text-blue-600"></i><span>Address: 290 Nơ Trang Long, Phường 12, Quận Bình Thạnh, TP.HCM</span></li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-phone text-blue-600"></i><span>Hotline EV: +84 0123456789</span></li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-envelope text-blue-600"></i><span>Email: ev-coownership@mail.com</span></li>
              </ul>
              <div>
                <p className="text-sm font-semibold text-gray-900">Theo Dõi Chúng Tôi</p>
                <div className="flex items-center gap-3 mt-2 text-gray-600">
                  <a href="#" aria-label="facebook" className="hover:text-blue-600"><i className="fa-brands fa-facebook-f"></i></a>
                  <a href="#" aria-label="twitter" className="hover:text-blue-600"><i className="fa-brands fa-x-twitter"></i></a>
                  <a href="#" aria-label="linkedin" className="hover:text-blue-600"><i className="fa-brands fa-linkedin-in"></i></a>
                  <a href="#" aria-label="instagram" className="hover:text-blue-600"><i className="fa-brands fa-instagram"></i></a>
                </div>
              </div>
            </div>
            {/* Right: Google map */}
            <div className="w-full h-[260px] sm:h-[320px] lg:h-[300px] overflow-hidden rounded-md border">
              <iframe
                title="map-ho-chi-minh"
                className="w-full h-full"
                src="https://www.google.com/maps?q=Ho%20Chi%20Minh%20City%2C%20Vietnam&z=11&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom section: title + form */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-xl sm:text-2xl font-extrabold text-gray-900">Nhận Tư Vấn Cho Nhóm Đồng Sở Hữu EV</h3>
          <form className="mt-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">HỌ TÊN</label>
                <input type="text" placeholder="Tên của bạn" className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">EMAIL *</label>
                <input type="email" placeholder="Email liên hệ" className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">CHỦ ĐỀ</label>
                <input type="text" placeholder="Ví dụ: Lập nhóm 5 người" className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1">NỘI DUNG *</label>
              <textarea placeholder="Mô tả nhu cầu: số thành viên, tỉ lệ góp, tần suất sử dụng..." rows="6" className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mt-6 flex justify-center">
              <button type="button" className="px-6 py-2 rounded-md text-white" style={{ backgroundColor: '#cc1bcf' }}>Gửi Yêu Cầu</button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactPage;

import React from "react";
// import bgGarage from "../../img/search-image.jpg";

export default function HomePage() {
  return (
    <div className="font-sans min-h-screen">

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center text-center text-white bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      >

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

        {/* Car Inventory Section */}
        <section id="warehouse" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Kho xe VinFast</h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                Quản lý toàn bộ kho xe điện VinFast với thông tin chi tiết, trạng thái và lịch sử bảo trì của từng chiếc xe
              </p>
            </div>
      
        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="grid" aria-label="Danh sách xe VinFast">
              {/* VF 3 Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105" role="gridcell">
                <div className="p-6">
                  {/* Status and ID */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Chờ kiểm tra</span>
                    <span className="text-sm text-gray-500">ID: 006</span>
                  </div>

                  {/* Category and Power Type */}
                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">City Car</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Điện</span>
                  </div>

                  {/* Car Image */}
                  <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="VF 3 - VinFast City Car" 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Model */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">VF 3</h3>
                  <p className="text-gray-600 mb-4">VF 3</p>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-blue-600">235.000.000 VNĐ</span>
                    <span className="text-sm text-gray-500 line-through ml-2">255.000.000 VNĐ</span>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                      </svg>
                      <span className="text-sm">210 km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">43 HP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">16.0s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span className="text-sm">4 chỗ</span>
                    </div>
                  </div>

                  {/* Color Options */}
                  <div className="flex gap-2 mb-4">
                    <div className="w-6 h-6 bg-black rounded-full border-2 border-white shadow"></div>
                    <div className="w-6 h-6 bg-white rounded-full border border-gray-300"></div>
                    <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                    <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                    <div className="w-6 h-6 bg-pink-400 rounded-full"></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Chỉnh sửa
                    </button>
                    <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 000 4zM10 12a2 2 0 110-4 2 2 0 000 4zM10 18a2 2 0 110-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* VF 5 Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105" role="gridcell">
                <div className="p-6">
                  {/* Status and ID */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">Đang bảo trì</span>
                    <span className="text-sm text-gray-500">ID: 005</span>
                  </div>

                  {/* Category and Power Type */}
                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Hatchback</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Điện</span>
                  </div>

                  {/* Car Image */}
                  <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1549317331-15d33c1eef9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="VF 5 - VinFast Hatchback" 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Model */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">VF 5</h3>
                  <p className="text-gray-600 mb-4">VF 5 Plus</p>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-blue-600">548.000.000 VNĐ</span>
                    <span className="text-sm text-gray-500 line-through ml-2">610.000.000 VNĐ</span>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                      </svg>
                      <span className="text-sm">285 km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">134 HP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">9.8s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span className="text-sm">5 chỗ</span>
                    </div>
                  </div>

                  {/* Color Options */}
                  <div className="flex gap-2 mb-4">
                    <div className="w-6 h-6 bg-black rounded-full border-2 border-white shadow"></div>
                    <div className="w-6 h-6 bg-white rounded-full border border-gray-300"></div>
                    <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                    <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Chỉnh sửa
                    </button>
                    <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 000 4zM10 12a2 2 0 110-4 2 2 0 000 4zM10 18a2 2 0 110-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* VF 6 Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105" role="gridcell">
                <div className="p-6">
                  {/* Status and ID */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Đã bán</span>
                    <span className="text-sm text-gray-500">ID: 003</span>
                  </div>

                  {/* Category and Power Type */}
                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">SUV Compact</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Điện</span>
                  </div>

                  {/* Car Image */}
                  <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="VF 6 - VinFast SUV Compact" 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Model */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">VF 6</h3>
                  <p className="text-gray-600 mb-4">VF 6 S</p>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-blue-600">765.000.000 VNĐ</span>
                    <span className="text-sm text-gray-500 line-through ml-2">850.000.000 VNĐ</span>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                      </svg>
                      <span className="text-sm">388 km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">177 HP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">8.9s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span className="text-sm">5 chỗ</span>
                    </div>
                  </div>

                  {/* Color Options */}
                  <div className="flex gap-2 mb-4">
                    <div className="w-6 h-6 bg-black rounded-full border-2 border-white shadow"></div>
                    <div className="w-6 h-6 bg-white rounded-full border border-gray-300"></div>
                    <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Chỉnh sửa
                    </button>
                    <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 000 4zM10 12a2 2 0 110-4 2 2 0 000 4zM10 18a2 2 0 110-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Management Features Section */}
        <section id="management" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Tính năng quản lý</h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                Hệ thống quản lý garage toàn diện với các tính năng hiện đại, giúp vận hành garage hiệu quả và chuyên nghiệp
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="grid" aria-label="Tính năng quản lý">
              {/* Feature 1: Vehicle Inventory Management */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105" role="gridcell">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Quản lý kho xe</h3>
                <p className="text-gray-600">
                  Theo dõi tất cả xe trong kho với thông tin chi tiết, trạng thái và lịch sử của từng chiếc xe
                </p>
              </div>

              {/* Feature 2: Maintenance Schedule */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105" role="gridcell">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Lịch bảo trì</h3>
                <p className="text-gray-600">
                  Quản lý lịch bảo trì định kỳ, theo dõi tình trạng và lập kế hoạch bảo dưỡng xe
                </p>
              </div>

              {/* Feature 3: Statistical Reports */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105" role="gridcell">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Báo cáo thống kê</h3>
                <p className="text-gray-600">
                  Tạo báo cáo chi tiết về hoạt động garage, hiệu suất và tình hình kinh doanh
                </p>
              </div>

              {/* Feature 4: Staff Management */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105" role="gridcell">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Quản lý nhân viên</h3>
                <p className="text-gray-600">
                  Phân quyền và quản lý nhân viên, theo dõi công việc và hiệu suất làm việc
                </p>
              </div>

              {/* Feature 5: Automatic Notifications */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105" role="gridcell">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Thông báo tự động</h3>
                <p className="text-gray-600">
                  Nhận thông báo về lịch bảo trì, cảnh báo và các sự kiện quan trọng
                </p>
              </div>

              {/* Feature 6: Cloud Storage */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105" role="gridcell">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Lưu trữ đám mây</h3>
                <p className="text-gray-600">
                  Dữ liệu được lưu trữ an toàn trên cloud, truy cập mọi lúc mọi nơi
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
              <h2 className="text-4xl font-bold mb-6">Dashboard quản lý thông minh</h2>
              <p className="text-lg mb-12 max-w-4xl mx-auto">
                Theo dõi mọi hoạt động của garage trong thời gian thực với giao diện trực quan và dễ sử dụng
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-lg">Giám sát liên tục</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">99.9%</div>
                  <div className="text-lg">Thời gian hoạt động</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">&lt;2s</div>
                  <div className="text-lg">Tốc độ phản hồi</div>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="flex justify-center">
                <button className="flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Truy cập Dashboard
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Us */}
        <section id="about" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 md:flex md:items-center">
            {/* Image */}
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="relative">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIOOcA7LkLCgDlsqBCwUznUf34i7A9UrRWng&s" 
                  alt="SCS Garage - Professional Car Service" 
                  className="w-full h-96 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-opacity-20 rounded-lg"></div>
              </div>
            </div>
            {/* Text */}
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Kho xe
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

      </div>
    );
  }

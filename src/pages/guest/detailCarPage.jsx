import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import { FaCar, FaCalendarAlt, FaWrench, FaShieldAlt, FaUsers, FaCheck, FaTimes, FaArrowLeft, FaShareAlt, FaHeart, FaDownload } from 'react-icons/fa';

const DetailCarPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInterested, setIsInterested] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);

  // Sample vehicle data - in real app, this would be fetched based on ID
  const vehicle = {
    id: parseInt(id) || 1,
    name: 'Tesla Model 3 2023',
    license: '30A-12345',
    type: 'Electric Sedan',
    status: 'Available',
    location: 'Garage A',
    mileage: 8000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    color: 'Pearl White',
    year: 2023,
    price: 1200000000,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1549317331-15d33c1eef9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ],
    specifications: {
      battery: '75 kWh',
      range: '560 km',
      acceleration: '4.4s (0-100 km/h)',
      topSpeed: '225 km/h',
      charging: '250 kW DC Fast Charging',
      seats: 5,
      doors: 4,
      weight: '1847 kg',
      dimensions: '4694 x 1850 x 1443 mm'
    },
    features: [
      'Autopilot',
      'Premium Interior',
      'Glass Roof',
      'Premium Audio',
      'Navigation',
      'Climate Control',
      'Keyless Entry',
      'Backup Camera',
      'Bluetooth',
      'USB Ports'
    ],
    maintenance: {
      lastService: '2024-01-15',
      nextService: '2024-07-15',
      serviceHistory: [
        { date: '2024-01-15', type: 'Regular Service', cost: 2500000, mileage: 8000 },
        { date: '2023-10-20', type: 'Battery Check', cost: 1500000, mileage: 5000 },
        { date: '2023-07-10', type: 'Software Update', cost: 500000, mileage: 2000 }
      ]
    },
    insurance: {
      provider: 'Bảo Việt',
      policyNumber: 'BV-2024-001234',
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      premium: 4500000,
      coverage: 'Toàn diện',
      deductible: 500000
    },
    coOwnership: {
      currentOwners: 1,
      maxOwners: 4,
      availableShares: 75,
      minimumShare: 10,
      monthlyCost: 2500000,
      description: 'Tìm kiếm đồng sở hữu cho xe Tesla Model 3, phù hợp cho nhóm 2-4 người. Xe được bảo dưỡng định kỳ và có bảo hiểm toàn diện.'
    },
    owner: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '0123456789',
      joinDate: '2024-01-15',
      rating: 4.8,
      reviews: 24
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleBack = () => {
    navigate('/warehouse');
  };

  const handleInterest = () => {
    setIsInterested(!isInterested);
  };

  const handleContract = () => {
    setShowContractModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Quay lại danh sách xe
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vehicle Images */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all">
                    <FaHeart className={`w-5 h-5 ${isInterested ? 'text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all">
                    <FaShareAlt className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              {/* Image Thumbnails */}
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {vehicle.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${vehicle.name} ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span className="flex items-center">
                      <FaCar className="mr-1" />
                      {vehicle.type}
                    </span>
                    <span>•</span>
                    <span>{vehicle.year}</span>
                    <span>•</span>
                    <span>{vehicle.mileage.toLocaleString()} km</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{formatPrice(vehicle.price)}</div>
                  <div className="text-sm text-gray-500">Giá thị trường</div>
                </div>
              </div>

              {/* Status and Location */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    vehicle.status === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vehicle.status}
                  </span>
                  <span className="text-gray-600">📍 {vehicle.location}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Biển số: <span className="font-medium">{vehicle.license}</span>
                </div>
              </div>

              {/* Key Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{vehicle.specifications.range}</div>
                  <div className="text-sm text-gray-600">Tầm hoạt động</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{vehicle.specifications.acceleration}</div>
                  <div className="text-sm text-gray-600">Tăng tốc</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{vehicle.specifications.seats}</div>
                  <div className="text-sm text-gray-600">Số chỗ ngồi</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{vehicle.specifications.battery}</div>
                  <div className="text-sm text-gray-600">Dung lượng pin</div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tính năng nổi bật</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <FaCheck className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Co-ownership Information */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Thông tin đồng sở hữu</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{vehicle.coOwnership.currentOwners}/{vehicle.coOwnership.maxOwners}</div>
                    <div className="text-sm text-blue-700">Đồng sở hữu hiện tại</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{vehicle.coOwnership.availableShares}%</div>
                    <div className="text-sm text-blue-700">% Sở hữu có sẵn</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{formatPrice(vehicle.coOwnership.monthlyCost)}</div>
                    <div className="text-sm text-blue-700">Chi phí/tháng</div>
                  </div>
                </div>
                <p className="text-blue-800">{vehicle.coOwnership.description}</p>
              </div>
            </div>

            {/* Maintenance History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử bảo dưỡng</h3>
              <div className="space-y-4">
                {vehicle.maintenance.serviceHistory.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <FaWrench className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{service.type}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(service.date).toLocaleDateString('vi-VN')} • {service.mileage.toLocaleString()} km
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{formatPrice(service.cost)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insurance Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bảo hiểm</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nhà bảo hiểm:</span>
                      <span className="font-medium">{vehicle.insurance.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số hợp đồng:</span>
                      <span className="font-medium">{vehicle.insurance.policyNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại bảo hiểm:</span>
                      <span className="font-medium">{vehicle.insurance.coverage}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí bảo hiểm:</span>
                      <span className="font-medium">{formatPrice(vehicle.insurance.premium)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hiệu lực:</span>
                      <span className="font-medium">
                        {new Date(vehicle.insurance.startDate).toLocaleDateString('vi-VN')} - {new Date(vehicle.insurance.endDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mức khấu trừ:</span>
                      <span className="font-medium">{formatPrice(vehicle.insurance.deductible)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chủ xe</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <FaUsers className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{vehicle.owner.name}</div>
                  <div className="text-sm text-gray-600">Tham gia từ {new Date(vehicle.owner.joinDate).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-20">Email:</span>
                  <span className="font-medium">{vehicle.owner.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-20">Phone:</span>
                  <span className="font-medium">{vehicle.owner.phone}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(vehicle.owner.rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">({vehicle.owner.reviews} đánh giá)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác</h3>
              <div className="space-y-3">
                <button
                  onClick={handleInterest}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isInterested
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isInterested ? 'Đã quan tâm' : 'Quan tâm'}
                </button>
                <button
                  onClick={handleContract}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Đề nghị đồng sở hữu
                </button>
                <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <FaDownload className="mr-2" />
                  Tải tài liệu
                </button>
              </div>
            </div>

            {/* Co-ownership Terms */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Điều khoản đồng sở hữu</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <FaCheck className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                  <span>Tối thiểu {vehicle.coOwnership.minimumShare}% sở hữu</span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                  <span>Chia sẻ chi phí theo tỷ lệ sở hữu</span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                  <span>Quyền sử dụng theo lịch đặt trước</span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                  <span>Bảo hiểm và bảo dưỡng được chia sẻ</span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                  <span>Hợp đồng pháp lý rõ ràng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Modal */}
      {showContractModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Đề nghị đồng sở hữu</h3>
              <button
                onClick={() => setShowContractModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Thông tin xe</h4>
                <p className="text-blue-800">{vehicle.name} - {vehicle.license}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  % Sở hữu mong muốn
                </label>
                <input
                  type="range"
                  min={vehicle.coOwnership.minimumShare}
                  max={vehicle.coOwnership.availableShares}
                  defaultValue="25"
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>{vehicle.coOwnership.minimumShare}%</span>
                  <span className="font-medium">25%</span>
                  <span>{vehicle.coOwnership.availableShares}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do quan tâm
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả lý do bạn muốn đồng sở hữu xe này..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thông tin liên hệ
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 mr-2"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  Tôi đồng ý với các điều khoản và điều kiện đồng sở hữu, và hiểu rằng đề nghị này sẽ được xem xét bởi chủ xe.
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowContractModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Gửi đề nghị
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DetailCarPage;

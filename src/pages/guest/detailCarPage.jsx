import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import { FaCar, FaWrench, FaCheck, FaArrowLeft, FaShareAlt, FaHeart } from 'react-icons/fa';

const DetailCarPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
                    <FaHeart className="w-5 h-5 text-gray-600" />
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

              {/* Vehicle Description */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả xe</h3>
                <p className="text-gray-700 leading-relaxed">
                  {vehicle.name} là một chiếc xe điện hiện đại với thiết kế sang trọng và công nghệ tiên tiến. 
                  Xe được trang bị pin lithium-ion hiệu suất cao, hệ thống lái tự động Autopilot, 
                  và nội thất premium với nhiều tính năng thông minh. Phù hợp cho việc sử dụng hàng ngày 
                  và các chuyến đi dài với tầm hoạt động lên đến {vehicle.specifications.range}.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vehicle Specifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông số kỹ thuật</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Dung lượng pin:</span>
                  <span className="font-medium">{vehicle.specifications.battery}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tầm hoạt động:</span>
                  <span className="font-medium">{vehicle.specifications.range}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tăng tốc (0-100 km/h):</span>
                  <span className="font-medium">{vehicle.specifications.acceleration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tốc độ tối đa:</span>
                  <span className="font-medium">{vehicle.specifications.topSpeed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sạc nhanh:</span>
                  <span className="font-medium">{vehicle.specifications.charging}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số chỗ ngồi:</span>
                  <span className="font-medium">{vehicle.specifications.seats}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trọng lượng:</span>
                  <span className="font-medium">{vehicle.specifications.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kích thước:</span>
                  <span className="font-medium">{vehicle.specifications.dimensions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <Footer />
    </div>
  );
};

export default DetailCarPage;

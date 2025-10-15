import React, { useState } from 'react';
import { FaSearch, FaFilter, FaCar, FaCalendarAlt, FaWrench, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const WarehousePage = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      name: 'Toyota Camry 2023',
      license: 'ABC-123',
      type: 'Sedan',
      status: 'Available',
      location: 'Garage A',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
      mileage: 15000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      color: 'White',
      year: 2023,
      price: 850000000
    },
    {
      id: 2,
      name: 'Honda Civic 2023',
      license: 'XYZ-789',
      type: 'Sedan',
      status: 'In Service',
      location: 'Service Bay 2',
      lastMaintenance: '2024-02-10',
      nextMaintenance: '2024-05-10',
      mileage: 12000,
      fuelType: 'Gasoline',
      transmission: 'Manual',
      color: 'Silver',
      year: 2023,
      price: 750000000
    },
    {
      id: 3,
      name: 'Tesla Model 3 2023',
      license: 'DEF-456',
      type: 'Electric',
      status: 'Available',
      location: 'Garage B',
      lastMaintenance: '2024-02-01',
      nextMaintenance: '2024-05-01',
      mileage: 8000,
      fuelType: 'Electric',
      transmission: 'Automatic',
      color: 'Black',
      year: 2023,
      price: 1200000000
    },
    {
      id: 4,
      name: 'BMW X5 2023',
      license: 'GHI-789',
      type: 'SUV',
      status: 'Maintenance',
      location: 'Service Bay 1',
      lastMaintenance: '2024-02-05',
      nextMaintenance: '2024-05-05',
      mileage: 18000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      color: 'Blue',
      year: 2023,
      price: 1500000000
    },
    {
      id: 5,
      name: 'Ford F-150 2023',
      license: 'JKL-012',
      type: 'Pickup',
      status: 'Available',
      location: 'Garage C',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-04-20',
      mileage: 22000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      color: 'Red',
      year: 2023,
      price: 950000000
    },
    {
      id: 6,
      name: 'Audi A4 2023',
      license: 'MNO-345',
      type: 'Sedan',
      status: 'Available',
      location: 'Garage A',
      lastMaintenance: '2024-02-12',
      nextMaintenance: '2024-05-12',
      mileage: 11000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      color: 'Gray',
      year: 2023,
      price: 1100000000
    },
    {
      id: 7,
      name: 'Mercedes C-Class 2023',
      license: 'PQR-678',
      type: 'Sedan',
      status: 'In Service',
      location: 'Service Bay 3',
      lastMaintenance: '2024-02-08',
      nextMaintenance: '2024-05-08',
      mileage: 14000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      color: 'White',
      year: 2023,
      price: 1300000000
    },
    {
      id: 8,
      name: 'Volkswagen Golf 2023',
      license: 'STU-901',
      type: 'Hatchback',
      status: 'Available',
      location: 'Garage B',
      lastMaintenance: '2024-01-25',
      nextMaintenance: '2024-04-25',
      mileage: 16000,
      fuelType: 'Gasoline',
      transmission: 'Manual',
      color: 'Yellow',
      year: 2023,
      price: 650000000
    },
    {
      id: 9,
      name: 'Nissan Altima 2023',
      license: 'VWX-234',
      type: 'Sedan',
      status: 'Maintenance',
      location: 'Service Bay 2',
      lastMaintenance: '2024-02-14',
      nextMaintenance: '2024-05-14',
      mileage: 19000,
      fuelType: 'Gasoline',
      transmission: 'CVT',
      color: 'Black',
      year: 2023,
      price: 700000000
    },
    {
      id: 10,
      name: 'Hyundai Sonata 2023',
      license: 'YZA-567',
      type: 'Sedan',
      status: 'Available',
      location: 'Garage C',
      lastMaintenance: '2024-02-03',
      nextMaintenance: '2024-05-03',
      mileage: 13000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      color: 'Silver',
      year: 2023,
      price: 600000000
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.color.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'All Types' || vehicle.type === typeFilter;
    const matchesLocation = locationFilter === 'All Locations' || vehicle.location === locationFilter;
    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Available': 'bg-green-100 text-green-800',
      'In Service': 'bg-blue-100 text-blue-800',
      'Maintenance': 'bg-yellow-100 text-yellow-800',
      'Unavailable': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Danh mục EV cho đồng sở hữu</h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Xem các mẫu EV phù hợp với nhu cầu nhóm, phạm vi di chuyển, hiệu năng và chi phí vận hành.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm xe theo tên, biển số, loại xe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Tất cả trạng thái</option>
              <option>Available</option>
              <option>In Service</option>
              <option>Maintenance</option>
              <option>Unavailable</option>
            </select>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Tất cả loại xe</option>
              <option>Sedan</option>
              <option>SUV</option>
              <option>Hatchback</option>
              <option>Pickup</option>
              <option>Electric</option>
            </select>
          </div>
          <div className="mt-4">
            <select 
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Tất cả vị trí</option>
              <option>Garage A</option>
              <option>Garage B</option>
              <option>Garage C</option>
              <option>Service Bay 1</option>
              <option>Service Bay 2</option>
              <option>Service Bay 3</option>
            </select>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" role="grid" aria-label="Danh sách EV cho đồng sở hữu">
          {currentVehicles.map(vehicle => (
            <div key={vehicle.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105" role="gridcell">
              <div className="p-6">
                {/* Status and ID */}
                <div className="flex justify-between items-start mb-4">
                  {getStatusBadge(vehicle.status)}
                  <span className="text-sm text-gray-500">Mã xe: {vehicle.id.toString().padStart(3, '0')}</span>
                </div>

                {/* Category and Power Type */}
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{vehicle.type}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">{vehicle.fuelType}</span>
                </div>

                {/* Car Image */}
                <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt={`${vehicle.name} - ${vehicle.type}`} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Model */}
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{vehicle.name}</h3>
                <p className="text-gray-600 mb-4">Phù hợp {vehicle.status === 'Available' ? '2–4' : '3–5'} đồng sở hữu</p>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(vehicle.price)}</span>
                  <span className="text-sm text-gray-500 ml-2">(chia theo tỉ lệ góp vốn)</span>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                    </svg>
                    <span className="text-sm">{vehicle.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{vehicle.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{vehicle.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-sm">{vehicle.color}</span>
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
                    Đề nghị đồng sở hữu
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
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center py-4">
          <div className="flex justify-center sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
          <div className="hidden sm:block">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                  );
                }
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WarehousePage;

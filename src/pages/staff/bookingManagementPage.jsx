import React, { useState } from 'react';
import { FaCalendarAlt, FaSearch, FaEye, FaEdit, FaCheck, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      bookingId: '#BK001',
      customer: { name: 'John Doe', email: 'john@example.com' },
      vehicle: { name: 'Toyota Camry 2023', license: 'ABC-123' },
      date: '2024-02-15',
      time: '10:00 - 12:00',
      status: 'Pending'
    },
    {
      id: 2,
      bookingId: '#BK002',
      customer: { name: 'Jane Smith', email: 'jane@example.com' },
      vehicle: { name: 'Honda Civic 2023', license: 'XYZ-789' },
      date: '2024-02-16',
      time: '14:00 - 16:00',
      status: 'Confirmed'
    },
    {
      id: 3,
      bookingId: '#BK003',
      customer: { name: 'Bob Wilson', email: 'bob@example.com' },
      vehicle: { name: 'Tesla Model 3 2023', license: 'DEF-456' },
      date: '2024-02-14',
      time: '09:00 - 11:00',
      status: 'In Progress'
    },
    {
      id: 4,
      bookingId: '#BK004',
      customer: { name: 'Alice Johnson', email: 'alice@example.com' },
      vehicle: { name: 'BMW X5 2023', license: 'GHI-789' },
      date: '2024-02-17',
      time: '11:00 - 13:00',
      status: 'Completed'
    },
    {
      id: 5,
      bookingId: '#BK005',
      customer: { name: 'Charlie Brown', email: 'charlie@example.com' },
      vehicle: { name: 'Ford F-150 2023', license: 'JKL-012' },
      date: '2024-02-18',
      time: '15:00 - 17:00',
      status: 'Cancelled'
    },
    {
      id: 6,
      bookingId: '#BK006',
      customer: { name: 'Diana Prince', email: 'diana@example.com' },
      vehicle: { name: 'Audi A4 2023', license: 'MNO-345' },
      date: '2024-02-19',
      time: '08:00 - 10:00',
      status: 'Pending'
    },
    {
      id: 7,
      bookingId: '#BK007',
      customer: { name: 'Eve Adams', email: 'eve@example.com' },
      vehicle: { name: 'Mercedes C-Class 2023', license: 'PQR-678' },
      date: '2024-02-20',
      time: '13:00 - 15:00',
      status: 'Confirmed'
    },
    {
      id: 8,
      bookingId: '#BK008',
      customer: { name: 'Frank Miller', email: 'frank@example.com' },
      vehicle: { name: 'Volkswagen Golf 2023', license: 'STU-901' },
      date: '2024-02-21',
      time: '16:00 - 18:00',
      status: 'In Progress'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('All Vehicles');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || booking.status === statusFilter;
    const matchesDate = !dateFilter || booking.date === dateFilter;
    const matchesVehicle = vehicleFilter === 'All Vehicles' || booking.vehicle.name === vehicleFilter;
    return matchesSearch && matchesStatus && matchesDate && matchesVehicle;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

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
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-green-100 text-green-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select 
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option>All Vehicles</option>
            <option>Toyota Camry 2023</option>
            <option>Honda Civic 2023</option>
            <option>Tesla Model 3 2023</option>
            <option>BMW X5 2023</option>
            <option>Ford F-150 2023</option>
            <option>Audi A4 2023</option>
            <option>Mercedes C-Class 2023</option>
            <option>Volkswagen Golf 2023</option>
          </select>
        </div>
      </div>

      {/* Booking List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                    {booking.bookingId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
                      <div className="text-sm text-gray-500">{booking.customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.vehicle.name}</div>
                      <div className="text-sm text-gray-500">{booking.vehicle.license}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    <div>{booking.date}</div>
                    <div className="text-xs text-gray-500">{booking.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <FaEye />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1">
                        <FaCheck />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900 p-1">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1">
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center py-4">
        <div className="flex justify-center sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
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
  );
};

export default BookingManagementPage;

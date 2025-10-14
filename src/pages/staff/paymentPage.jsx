import React, { useState } from 'react';
import { FaCreditCard, FaSearch, FaEye, FaCheck, FaTimes, FaDownload, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PaymentPage = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      paymentId: '#PAY001',
      vehicle: { name: 'Toyota Camry 2023', license: 'ABC-123' },
      serviceType: 'Engine Repair',
      amount: 450.00,
      status: 'Paid',
      date: '2024-02-14'
    },
    {
      id: 2,
      paymentId: '#PAY002',
      vehicle: { name: 'Honda Civic 2023', license: 'XYZ-789' },
      serviceType: 'Regular Service',
      amount: 120.00,
      status: 'Pending',
      date: '2024-02-15'
    },
    {
      id: 3,
      paymentId: '#PAY003',
      vehicle: { name: 'Tesla Model 3 2023', license: 'DEF-456' },
      serviceType: 'Battery Replacement',
      amount: 1200.00,
      status: 'Failed',
      date: '2024-02-13'
    },
    {
      id: 4,
      paymentId: '#PAY004',
      vehicle: { name: 'BMW X5 2023', license: 'GHI-789' },
      serviceType: 'Emergency Repair',
      amount: 800.00,
      status: 'Paid',
      date: '2024-02-12'
    },
    {
      id: 5,
      paymentId: '#PAY005',
      vehicle: { name: 'Ford F-150 2023', license: 'JKL-012' },
      serviceType: 'Transmission Repair',
      amount: 650.00,
      status: 'Paid',
      date: '2024-02-11'
    },
    {
      id: 6,
      paymentId: '#PAY006',
      vehicle: { name: 'Audi A4 2023', license: 'MNO-345' },
      serviceType: 'Brake Service',
      amount: 320.00,
      status: 'Pending',
      date: '2024-02-10'
    },
    {
      id: 7,
      paymentId: '#PAY007',
      vehicle: { name: 'Mercedes C-Class 2023', license: 'PQR-678' },
      serviceType: 'Oil Change',
      amount: 85.00,
      status: 'Refunded',
      date: '2024-02-09'
    },
    {
      id: 8,
      paymentId: '#PAY008',
      vehicle: { name: 'Volkswagen Golf 2023', license: 'STU-901' },
      serviceType: 'Tire Replacement',
      amount: 400.00,
      status: 'Paid',
      date: '2024-02-08'
    },
    {
      id: 9,
      paymentId: '#PAY009',
      vehicle: { name: 'Nissan Altima 2023', license: 'VWX-234' },
      serviceType: 'AC Repair',
      amount: 280.00,
      status: 'Failed',
      date: '2024-02-07'
    },
    {
      id: 10,
      paymentId: '#PAY010',
      vehicle: { name: 'Hyundai Sonata 2023', license: 'YZA-567' },
      serviceType: 'Inspection',
      amount: 150.00,
      status: 'Paid',
      date: '2024-02-06'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [dateFilter, setDateFilter] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.vehicle.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || payment.status === statusFilter;
    const matchesType = typeFilter === 'All Types' || payment.serviceType === typeFilter;
    const matchesDate = !dateFilter || payment.date === dateFilter;
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

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
      'Paid': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Failed': 'bg-red-100 text-red-800',
      'Refunded': 'bg-gray-100 text-gray-800'
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
        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
            <FaDownload className="mr-2" />
            Export Report
          </button>
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
                placeholder="Search payments by vehicle, payment ID, or service type..."
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
            <option>All Status</option>
            <option>Pending</option>
            <option>Paid</option>
            <option>Failed</option>
            <option>Refunded</option>
          </select>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option>All Types</option>
            <option>Engine Repair</option>
            <option>Regular Service</option>
            <option>Battery Replacement</option>
            <option>Emergency Repair</option>
            <option>Transmission Repair</option>
            <option>Brake Service</option>
            <option>Oil Change</option>
            <option>Tire Replacement</option>
            <option>AC Repair</option>
            <option>Inspection</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="From Date"
          />
        </div>
      </div>

      {/* Payment List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Payment Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                    {payment.paymentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.vehicle.name}</div>
                      <div className="text-sm text-gray-500">{payment.vehicle.license}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {payment.serviceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <FaEye />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1">
                        <FaDownload />
                      </button>
                      {payment.status === 'Pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900 p-1">
                            <FaCheck />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1">
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {payment.status === 'Failed' && (
                        <button className="text-indigo-600 hover:text-indigo-900 p-1">
                          Retry
                        </button>
                      )}
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

export default PaymentPage;

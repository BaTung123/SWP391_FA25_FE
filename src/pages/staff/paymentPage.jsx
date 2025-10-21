import React, { useState } from 'react';
import {
  FaCreditCard,
  FaSearch,
  FaEye,
  FaCheck,
  FaTimes,
  FaDownload,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const PaymentPage = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      paymentId: '#PAY001',
      vehicle: { name: 'Toyota Camry 2023', license: 'ABC-123' },
      serviceType: 'Sửa động cơ',
      amount: 11500000,
      status: 'Đã thanh toán',
      date: '2024-02-14',
    },
    {
      id: 2,
      paymentId: '#PAY002',
      vehicle: { name: 'Honda Civic 2023', license: 'XYZ-789' },
      serviceType: 'Bảo dưỡng định kỳ',
      amount: 3000000,
      status: 'Chờ thanh toán',
      date: '2024-02-15',
    },
    {
      id: 3,
      paymentId: '#PAY003',
      vehicle: { name: 'Tesla Model 3 2023', license: 'DEF-456' },
      serviceType: 'Thay pin',
      amount: 28000000,
      status: 'Hủy',
      date: '2024-02-13',
    },
    {
      id: 4,
      paymentId: '#PAY004',
      vehicle: { name: 'BMW X5 2023', license: 'GHI-789' },
      serviceType: 'Sửa chữa khẩn cấp',
      amount: 20000000,
      status: 'Đã thanh toán',
      date: '2024-02-12',
    },
    {
      id: 5,
      paymentId: '#PAY005',
      vehicle: { name: 'Ford F-150 2023', license: 'JKL-012' },
      serviceType: 'Sửa hộp số',
      amount: 16000000,
      status: 'Đã thanh toán',
      date: '2024-02-11',
    },
    {
      id: 6,
      paymentId: '#PAY006',
      vehicle: { name: 'Audi A4 2023', license: 'MNO-345' },
      serviceType: 'Thay phanh',
      amount: 8500000,
      status: 'Chờ thanh toán',
      date: '2024-02-10',
    },
    {
      id: 7,
      paymentId: '#PAY007',
      vehicle: { name: 'Mercedes C-Class 2023', license: 'PQR-678' },
      serviceType: 'Thay dầu',
      amount: 2200000,
      status: 'Hủy',
      date: '2024-02-09',
    },
    {
      id: 8,
      paymentId: '#PAY008',
      vehicle: { name: 'Volkswagen Golf 2023', license: 'STU-901' },
      serviceType: 'Thay lốp',
      amount: 10000000,
      status: 'Đã thanh toán',
      date: '2024-02-08',
    },
    {
      id: 9,
      paymentId: '#PAY009',
      vehicle: { name: 'Nissan Altima 2023', license: 'VWX-234' },
      serviceType: 'Sửa điều hòa',
      amount: 7000000,
      status: 'Hủy',
      date: '2024-02-07',
    },
    {
      id: 10,
      paymentId: '#PAY010',
      vehicle: { name: 'Hyundai Sonata 2023', license: 'YZA-567' },
      serviceType: 'Kiểm tra tổng quát',
      amount: 4000000,
      status: 'Đã thanh toán',
      date: '2024-02-06',
    },
  ]);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = payments.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm định dạng tiền VND
  const formatCurrency = (amount) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Đã thanh toán': 'bg-green-100 text-green-800',
      'Chờ thanh toán': 'bg-yellow-100 text-yellow-800',
      'Hủy': 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý thanh toán</h1>
      </div>

      {/* Bảng thanh toán */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã giao dịch
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xe
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dịch vụ
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900 text-center">
                    {payment.paymentId}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.vehicle.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.vehicle.license}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-center">
                    {payment.serviceType}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-center">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <FaEye />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1">
                        <FaDownload />
                      </button>
                      {payment.status === 'Chờ thanh toán' && (
                        <>
                          <button className="text-green-600 hover:text-green-900 p-1">
                            <FaCheck />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1">
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {payment.status === 'Hủy' && (
                        <button className="text-indigo-600 hover:text-indigo-900 p-1">
                          Thử lại
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

      {/* Điều hướng phân trang */}
      <div className="flex items-center justify-center py-4">
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default PaymentPage;

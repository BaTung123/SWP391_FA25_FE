import React, { useState, useEffect } from 'react';
import { FaQrcode, FaWallet, FaCreditCard, FaMobile, FaCheck, FaTimes, FaHistory, FaDownload, FaPrint } from 'react-icons/fa';

const QRPage = () => {
  const [activeTab, setActiveTab] = useState('topup');
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('qr');
  const [showQR, setShowQR] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(2500000);
  
  // Sample transaction history
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'Top-up',
      amount: 1000000,
      method: 'QR Code',
      status: 'Completed',
      date: '2024-02-15',
      time: '14:30',
      reference: 'TXN-20240215-001'
    },
    {
      id: 2,
      type: 'Service Payment',
      amount: -250000,
      method: 'Wallet',
      status: 'Completed',
      date: '2024-02-14',
      time: '09:15',
      reference: 'SRV-20240214-002'
    },
    {
      id: 3,
      type: 'Top-up',
      amount: 500000,
      method: 'Bank Transfer',
      status: 'Completed',
      date: '2024-02-10',
      time: '16:45',
      reference: 'TXN-20240210-003'
    },
    {
      id: 4,
      type: 'Service Payment',
      amount: -180000,
      method: 'Wallet',
      status: 'Completed',
      date: '2024-02-08',
      time: '11:20',
      reference: 'SRV-20240208-004'
    },
    {
      id: 5,
      type: 'Top-up',
      amount: 2000000,
      method: 'Credit Card',
      status: 'Completed',
      date: '2024-02-05',
      time: '13:10',
      reference: 'TXN-20240205-005'
    }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    method: 'qr',
    description: ''
  });

  const paymentMethods = [
    { id: 'qr', name: 'QR Code', icon: <FaQrcode />, description: 'Quét mã QR để thanh toán' },
    { id: 'bank', name: 'Chuyển khoản ngân hàng', icon: <FaCreditCard />, description: 'Chuyển khoản qua ngân hàng' },
    { id: 'card', name: 'Thẻ tín dụng', icon: <FaCreditCard />, description: 'Thanh toán bằng thẻ tín dụng' },
    { id: 'mobile', name: 'Ví điện tử', icon: <FaMobile />, description: 'Ví điện tử (Momo, ZaloPay, VNPay)' }
  ];

  const quickAmounts = [100000, 250000, 500000, 1000000, 2000000, 5000000];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAmountChange = (value) => {
    setAmount(value);
    setNewTransaction({ ...newTransaction, amount: value });
  };

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
    setNewTransaction({ ...newTransaction, amount: value.toString() });
  };

  const handleTopUp = () => {
    if (amount && parseFloat(amount) > 0) {
      setShowQR(true);
      // In real app, this would generate actual QR code and initiate payment
    }
  };

  const handlePaymentComplete = () => {
    const newAmount = parseFloat(amount);
    setCurrentBalance(prev => prev + newAmount);
    
    // Add to transaction history
    const transaction = {
      id: transactions.length + 1,
      type: 'Top-up',
      amount: newAmount,
      method: paymentMethods.find(m => m.id === selectedMethod)?.name || 'QR Code',
      status: 'Completed',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      reference: `TXN-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(transactions.length + 1).padStart(3, '0')}`
    };
    
    setTransactions([transaction, ...transactions]);
    setShowQR(false);
    setAmount('');
    setNewTransaction({ amount: '', method: 'qr', description: '' });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Failed': 'bg-red-100 text-red-800',
      'Processing': 'bg-blue-100 text-blue-800'
    };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="w-full">
      <div className="rounded-lg bg-white p-6">
        <h2 className="text-4xl font-bold text-indigo-900 mb-6">Ví điện tử</h2>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-2">Số dư hiện tại</h3>
              <p className="text-3xl font-bold">{formatPrice(currentBalance)}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <FaWallet className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-indigo-100 mb-8">
          <div
            className={`py-2 font-semibold cursor-pointer mr-8 text-[16px] tracking-wider transition-all ${
              activeTab === 'topup' 
                ? 'text-indigo-900 border-b-3 border-indigo-900' 
                : 'text-indigo-600 hover:text-indigo-800'
            }`}
            onClick={() => setActiveTab('topup')}
          >
            NẠP TIỀN
          </div>
          <div
            className={`py-2 font-semibold cursor-pointer mr-8 text-[16px] tracking-wider transition-all ${
              activeTab === 'history' 
                ? 'text-indigo-900 border-b-3 border-indigo-900' 
                : 'text-indigo-600 hover:text-indigo-800'
            }`}
            onClick={() => setActiveTab('history')}
          >
            LỊCH SỬ GIAO DỊCH
          </div>
        </div>

        {/* Top-up Tab */}
        {activeTab === 'topup' && (
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Chọn phương thức thanh toán</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => {
                      setSelectedMethod(method.id);
                      setNewTransaction({ ...newTransaction, method: method.id });
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`p-2 rounded-lg mr-3 ${
                        selectedMethod === method.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {method.icon}
                      </div>
                      <span className="font-medium text-gray-900">{method.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Nhập số tiền</h3>
              <div className="max-w-md">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="Nhập số tiền cần nạp"
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg text-lg focus:border-indigo-500 focus:outline-none"
                />
                <p className="text-sm text-gray-600 mt-2">Số tiền tối thiểu: {formatPrice(10000)}</p>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Số tiền nhanh</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => handleQuickAmount(quickAmount)}
                    className="p-3 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                  >
                    <span className="font-medium">{formatPrice(quickAmount)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top-up Button */}
            <div className="flex justify-center">
              <button
                onClick={handleTopUp}
                disabled={!amount || parseFloat(amount) < 10000}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Nạp tiền vào ví
              </button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Lịch sử giao dịch</h3>
              <div className="flex space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <FaDownload className="mr-2" />
                  Xuất file
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <FaPrint className="mr-2" />
                  In
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="border border-indigo-200 px-4 py-3 text-left font-semibold text-indigo-900">Loại giao dịch</th>
                    <th className="border border-indigo-200 px-4 py-3 text-left font-semibold text-indigo-900">Số tiền</th>
                    <th className="border border-indigo-200 px-4 py-3 text-left font-semibold text-indigo-900">Phương thức</th>
                    <th className="border border-indigo-200 px-4 py-3 text-left font-semibold text-indigo-900">Trạng thái</th>
                    <th className="border border-indigo-200 px-4 py-3 text-left font-semibold text-indigo-900">Ngày giờ</th>
                    <th className="border border-indigo-200 px-4 py-3 text-left font-semibold text-indigo-900">Mã tham chiếu</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="border border-indigo-200 px-4 py-3">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${
                            transaction.type === 'Top-up' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {transaction.type === 'Top-up' ? <FaWallet /> : <FaCreditCard />}
                          </div>
                          <span className="font-medium text-gray-900">{transaction.type}</span>
                        </div>
                      </td>
                      <td className="border border-indigo-200 px-4 py-3">
                        <span className={`font-medium ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{formatPrice(transaction.amount)}
                        </span>
                      </td>
                      <td className="border border-indigo-200 px-4 py-3 text-gray-700">
                        {transaction.method}
                      </td>
                      <td className="border border-indigo-200 px-4 py-3">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="border border-indigo-200 px-4 py-3 text-gray-700">
                        <div>
                          <div>{new Date(transaction.date).toLocaleDateString('vi-VN')}</div>
                          <div className="text-sm text-gray-500">{transaction.time}</div>
                        </div>
                      </td>
                      <td className="border border-indigo-200 px-4 py-3 text-gray-700">
                        <span className="font-mono text-sm">{transaction.reference}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quét mã QR để thanh toán</h3>
              
              {/* QR Code Placeholder */}
              <div className="bg-gray-100 rounded-lg p-8 mb-4 flex items-center justify-center">
                <div className="text-center">
                  <FaQrcode className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Mã QR sẽ được tạo tại đây</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-bold text-lg">{formatPrice(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium">{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-mono text-sm">TXN-{new Date().toISOString().split('T')[0].replace(/-/g, '')}-001</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowQR(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handlePaymentComplete}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Hoàn thành
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Vui lòng quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử của bạn
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRPage;

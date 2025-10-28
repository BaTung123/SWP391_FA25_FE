import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header'; // ✅ import header

const DepositPage = () => {
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const handleTopUp = () => {
    const value = parseFloat(amount);
    if (value >= 10000 && value <= 10000000) {
      // Chuyển sang trang QR thanh toán
      navigate('/member/qrcode', { 
        state: { amount: value } 
      });
    } else {
      alert('💰 Số tiền phải nằm trong khoảng từ 10.000 đến 10.000.000 VND.');
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // Không cho nhập số âm
    if (value < 0) return;
    // Không vượt quá 10 triệu
    if (value > 10000000) return;
    setAmount(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ Header */}
      <Header />

      {/* Nội dung trang */}
      <div className="flex flex-1 justify-center items-center">
        <div className="rounded-lg bg-white p-8 shadow-lg w-full max-w-md">
          <h1 className="text-4xl font-bold text-indigo-900 mb-8 text-center">
            Ví điện tử
          </h1>

          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Số tiền cần nạp:
              </label>
            </div>

            <input
              type="number"
              value={amount}
              onChange={handleChange}
              placeholder="Từ 10.000 đến 10.000.000"
              className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg text-lg focus:border-indigo-500 focus:outline-none"
              min="10000"
              max="10000000"
            />

            <button
              onClick={handleTopUp}
              disabled={!amount || parseFloat(amount) < 10000 || parseFloat(amount) > 10000000}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Nạp tiền
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;

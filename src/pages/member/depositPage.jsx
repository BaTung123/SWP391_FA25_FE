import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import api from '../../config/axios';
import Header from '../../components/header/header';

/** Helpers: đọc token & userId đã lưu sau Login */
function safeParseJSON(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function getStoredAuth() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token") || null;

  const userStr = localStorage.getItem("user");
  const user = userStr ? safeParseJSON(userStr) : null;

  const userIdStr = localStorage.getItem("userId");
  const fallbackId = user && (user.userId ?? user.id ?? user.ID);
  const userId =
    userIdStr != null
      ? Number(userIdStr)
      : fallbackId != null
      ? Number(fallbackId)
      : null;

  return { token, user, userId };
}

const DepositPage = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy auth từ local
  const [authState, setAuthState] = useState(() => getStoredAuth());
  const { token, userId } = authState;

  // Set header Authorization nếu có token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  const handleTopUp = async () => {
    const value = parseFloat(amount);
    
    if (value < 10000 || value > 10000000) {
      message.error('💰 Số tiền phải nằm trong khoảng từ 10.000 đến 10.000.000 VND.');
      return;
    }

    if (!userId) {
      message.error('Vui lòng đăng nhập để nạp tiền.');
      navigate('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const baseUrl = window.location.origin;
      const paymentPayload = {
        userId: userId,
        currency: "VND",
        amount: value,
        description: `Nạp tiền vào ví điện tử - ${value.toLocaleString('vi-VN')} VND`,
        transactionType: 0,
        returnUrl: `${baseUrl}/member/payment-success?orderCode={orderCode}&status={status}`,
        cancelUrl: `${baseUrl}/member/payment-cancelled?orderCode={orderCode}&status={status}`
      };

      console.log('Calling Payment API with payload:', paymentPayload);
      
      // Thử các endpoint khác nhau nếu 404
      const endpoints = [
        '/Payment/payos',
        '/Payment/PayOS',
        '/payment/payos',
        '/Payment/Payos'
      ];
      
      let response;
      let lastError;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying POST ${endpoint}...`);
          response = await api.post(endpoint, paymentPayload, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log(`Success with endpoint: ${endpoint}`);
          break; // Thành công, thoát khỏi loop
        } catch (error) {
          lastError = error;
          if (error?.response?.status === 404) {
            console.log(`Endpoint ${endpoint} returned 404, trying next...`);
            continue; // Thử endpoint tiếp theo
          } else {
            // Lỗi khác 404, throw ngay
            throw error;
          }
        }
      }
      
      // Nếu tất cả endpoint đều 404, throw lỗi
      if (!response && lastError?.response?.status === 404) {
        throw new Error('Không tìm thấy endpoint thanh toán. Vui lòng kiểm tra backend API.');
      }
      
      if (!response) {
        throw lastError || new Error('Không thể kết nối đến server thanh toán.');
      }
      
      console.log('Payment API response:', response?.data);
      
      // Lấy URL thanh toán từ response (hỗ trợ nhiều cấu trúc response)
      const paymentUrl = response?.data?.data?.checkoutUrl || 
                        response?.data?.data?.url ||
                        response?.data?.checkoutUrl || 
                        response?.data?.url ||
                        response?.data?.link ||
                        response?.data;

      if (paymentUrl && typeof paymentUrl === 'string') {
        // Redirect đến trang thanh toán PayOS
        window.location.href = paymentUrl;
      } else {
        console.error('Invalid payment URL response:', response?.data);
        message.error('Không thể lấy URL thanh toán từ server. Vui lòng thử lại.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      console.error('Error details:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        url: error?.config?.url,
        method: error?.config?.method
      });
      
      let errorMessage = 'Có lỗi xảy ra khi tạo giao dịch thanh toán. Vui lòng thử lại.';
      
      if (error?.response?.status === 404) {
        errorMessage = 'Endpoint thanh toán không tìm thấy. Vui lòng liên hệ quản trị viên.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      message.error(errorMessage);
      setLoading(false);
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
              disabled={!amount || parseFloat(amount) < 10000 || parseFloat(amount) > 10000000 || loading}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Nạp tiền'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;

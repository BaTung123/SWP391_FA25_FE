import React, { useState, useEffect } from "react";
import { FaQrcode } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const QRPage = () => {
  const [amount, setAmount] = useState("");
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy amount từ state navigation
  useEffect(() => {
    if (location.state && location.state.amount) {
      setAmount(location.state.amount.toString());
      setShowQR(true);
    }
  }, [location]);

  const handleTopUp = () => {
    const value = parseFloat(amount);
    if (value >= 10000 && value <= 10000000) {
      setShowQR(true);
    } else {
      alert("Số tiền phải nằm trong khoảng từ 10.000 đến 10.000.000 VND.");
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value < 0 || value > 10000000) return;
    setAmount(value);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gray-50">
      <div className="rounded-lg bg-white p-8 shadow-lg w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-indigo-900 mb-8">Ví điện tử</h1>

        {!showQR ? (
          <>
            <label className="block text-left text-lg font-medium text-gray-700 mb-2">
              Số tiền cần nạp:
            </label>
            <input
              type="number"
              value={amount}
              onChange={handleChange}
              placeholder="Từ 10.000 đến 10.000.000"
              className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg text-lg focus:border-indigo-500 focus:outline-none mb-4"
              min="10000"
              max="10000000"
            />

            <button
              onClick={handleTopUp}
              disabled={
                !amount ||
                parseFloat(amount) < 10000 ||
                parseFloat(amount) > 10000000
              }
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Nạp tiền
            </button>
          </>
        ) : (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quét mã QR để thanh toán
            </h2>

            {/* QR giả lập */}
            <div className="bg-gray-100 p-8 rounded-lg inline-block mb-4">
              <FaQrcode className="text-gray-500 w-32 h-32 mx-auto" />
            </div>

            <p className="text-lg font-medium mb-2">
              Số tiền: {formatPrice(parseFloat(amount))}
            </p>
            <p className="text-gray-600 mb-6">
              Dùng ứng dụng ngân hàng hoặc ví điện tử để quét mã này.
            </p>

            <button
              onClick={() => {
                alert("Thanh toán thành công!");
                // Quay lại trang nạp tiền
                navigate('/member/wallet');
              }}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Xác nhận đã thanh toán
            </button>

            <button
              onClick={() => navigate('/member/wallet')}
              className="w-full mt-3 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRPage;

import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../../config/axios";

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

const PaymentCancelledPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");

  // Lấy auth từ local
  const [authState, setAuthState] = useState(() => getStoredAuth());
  const { userId } = authState;

  useEffect(() => {
    console.log("Payment Cancelled - orderCode:", orderCode, "status:", status);
    
    if (status && orderCode) {
      // Call API to update payment status (webhook)
      const updatePaymentStatus = async () => {
        try {
          // Thử các endpoint có thể có
          const endpoints = [
            '/Payment/capture/payos/' + orderCode
          ];
          
          let success = false;
          let lastError = null;
          
          for (const endpoint of endpoints) {
            try {
              console.log(`Trying PUT ${endpoint}...`);
              const response = await api.put(endpoint, { 
                orderCode,
                userId: userId,
              }, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              
              console.log(`Success with endpoint: ${endpoint}`, response?.data);
              success = true;
              break;
            } catch (error) {
              lastError = error;
              if (error?.response?.status === 404) {
                console.log(`Endpoint ${endpoint} returned 404, trying next...`);
                continue;
              } else {
                // Lỗi khác 404, throw ngay
                throw error;
              }
            }
          }
          
          if (!success && lastError) {
            throw lastError;
          }
        } catch (error) {
          console.error('Error updating payment status:', error);
          console.error('Error details:', {
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            data: error?.response?.data,
            url: error?.config?.url,
            method: error?.config?.method
          });
          // Không hiển thị error cho user vì đây là background update
        }
      };
      
      updatePaymentStatus();
    }
  }, [status, orderCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-5">
      <div
        className="bg-white p-10 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-center max-w-[500px] w-full md:p-8 md:px-5"
        style={{
          animation: "slideUp 0.5s ease",
        }}
      >
        <div
          className="text-[80px] text-[#dc3545] mb-5 md:text-[60px]"
          style={{
            animation: "scaleIn 0.5s ease",
          }}
        >
          <i className="bi bi-x-circle-fill"></i>
        </div>
        <h1 className="text-[#2c3e50] text-[28px] font-bold mb-4 md:text-2xl">
          Payment Cancelled
        </h1>
        <p className="text-[#666] text-base leading-relaxed mb-8 md:text-sm">
          Your payment has been cancelled. If you have any questions, please
          contact our support team.
        </p>
        {/* <div className="bg-[#f8f9fa] p-5 rounded-[10px] mb-8">
          <p className="my-2.5 text-[#555]">
            Order Code: <span className="font-bold text-[#2c3e50]">{orderCode}</span>
          </p>
          <p className="my-2.5 text-[#555]">
            Status: <span className="font-bold text-[#2c3e50]">{status}</span>
          </p>
        </div> */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#aaaaaa] to-[#888888] text-white px-8 py-3 rounded-[25px] no-underline font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)] hover:text-white"
        >
          <i className="bi bi-house-door text-lg"></i>
          Back to Home
        </Link>
      </div>
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }   
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentCancelledPage;

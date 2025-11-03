import React, { useState, useEffect } from 'react';
import Header from '../../components/header/header';
import api from '../../config/axios';

// Danh sách đánh giá (vote) cho member
const VoteList = () => {
  const [votes, setVotes] = useState([
    {
      id: 1,
      formId: 101,
      vehicleName: 'Tesla Model 3',
      licensePlate: '30A-12345',
      serviceType: 'Bảo dưỡng định kỳ',
      status: 'Chờ đánh giá',
      date: '2024-12-15',
      choice: null,
    },
    {
      id: 2,
      formId: 102,
      vehicleName: 'BYD Atto 3',
      licensePlate: '29B-67890',
      serviceType: 'Sửa hệ thống phanh',
      status: 'Đã đánh giá',
      date: '2024-12-10',
      choice: 'Đồng ý',
    },
  ]);
  const [submittingId, setSubmittingId] = useState(null);

  const getStatusBadge = (status) => {
    const classes =
      status === 'Đã đánh giá'
        ? 'bg-green-100 text-green-800'
        : 'bg-yellow-100 text-yellow-800';
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${classes}`}>
        {status}
      </span>
    );
  };

  const onVote = async (id, choice) => {
    const vote = votes.find((v) => v.id === id);
    if (!vote) return;

    // Lấy userId từ localStorage
    let userId = null;
    try {
      const userData = localStorage.getItem('user');
      userId = userData ? JSON.parse(userData)?.id ?? JSON.parse(userData)?.userId : null;
    } catch {}

    if (userId == null) {
      alert('Không xác định được người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    setSubmittingId(id);
    try {
      // API GET /Vote với query params
      await api.get('/Vote', {
        params: {
          userId,
          formId: vote.formId,
          decision: choice === 'Đồng ý',
        },
      });

      // Cập nhật UI khi thành công
      setVotes((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, status: 'Đã đánh giá', choice } : v
        )
      );
    } catch (e) {
      alert('Gửi đánh giá thất bại. Vui lòng thử lại.');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="bg-white border border-indigo-200 rounded-lg shadow-md overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-indigo-50">
            <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Xe</th>
            <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Dịch vụ</th>
            <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Trạng thái</th>
            <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Ngày</th>
            <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {votes.map((vote) => (
            <tr key={vote.id} className="hover:bg-gray-50 transition-colors">
              <td className="border border-indigo-200 px-4 py-3">
                <div className="font-medium text-gray-900">{vote.vehicleName}</div>
                <div className="text-sm text-gray-500">{vote.licensePlate}</div>
              </td>
              <td className="border border-indigo-200 px-4 py-3 text-gray-900 text-sm">{vote.serviceType}</td>
              <td className="border border-indigo-200 px-4 py-3 text-center">{getStatusBadge(vote.status)}</td>
              <td className="border border-indigo-200 px-4 py-3 text-sm text-gray-700 text-center">{vote.date}</td>
              <td className="border border-indigo-200 px-4 py-3">
                {vote.status === 'Chờ đánh giá' ? (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onVote(vote.id, 'Đồng ý')}
                      disabled={submittingId === vote.id}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm disabled:opacity-60"
                    >
                      Đồng ý
                    </button>
                    <button
                      onClick={() => onVote(vote.id, 'Từ chối')}
                      disabled={submittingId === vote.id}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm disabled:opacity-60"
                    >
                      Từ chối
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      vote.choice === 'Đồng ý'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vote.choice}
                    </span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCoOwnersModal, setShowCoOwnersModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  const [user, setUser] = useState({
    email: 'john.doe@example.com',
    avatarImageUrl: null,
    idCardImageUrl: null
  });

  // Kiểm tra role của user - chỉ hiển thị Header cho member (role = 0)
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserRole(parsedUser.role);
      }
    } catch {
      setUserRole(null);
    }
  }, []);
  
  const [form, setForm] = useState({
    name: 'John Doe',
    fullName: 'John Doe',
    phone: '',
    nationalId: '',
    licenseNumber: '',
    gender: '',
    dob: '',
    address: '',
    emergencyContact: '',
    drivingExperience: ''
  });

  // const drivingExperienceOptions = ['Dưới 1 năm', '1-3 năm', '3-5 năm', '5-10 năm', 'Trên 10 năm'];

  // Sample vehicle ownership data
  const vehicleData = [
    {
      id: 1,
      vehicleName: 'Tesla Model 3',
      licensePlate: '30A-12345',
      ownershipPercentage: 25,
      purchaseDate: '2024-01-15',
      status: 'Active',
      monthlyCost: 2500000,
      nextPayment: '2024-12-15',
      coOwners: [
        { name: 'John Doe', email: 'john.doe@example.com', percentage: 25, phone: '0123456789' },
        { name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', percentage: 30, phone: '0987654321' },
        { name: 'Trần Thị B', email: 'tranthib@example.com', percentage: 25, phone: '0912345678' },
        { name: 'Lê Văn C', email: 'levanc@example.com', percentage: 20, phone: '0923456789' }
      ],
      insurance: {
        provider: 'Bảo Việt',
        policyNumber: 'BV-2024-001234',
        startDate: '2024-01-15',
        endDate: '2025-01-15',
        premium: 4500000,
        coverage: 'Toàn diện',
        deductible: 500000,
        monthlyPayment: 375000,
        nextPayment: '2024-12-15',
        status: 'Active'
      }
    },
    {
      id: 2,
      vehicleName: 'BYD Atto 3',
      licensePlate: '29B-67890',
      ownershipPercentage: 15,
      purchaseDate: '2024-03-20',
      status: 'Active',
      monthlyCost: 1800000,
      nextPayment: '2024-12-20',
      coOwners: [
        { name: 'John Doe', email: 'john.doe@example.com', percentage: 15, phone: '0123456789' },
        { name: 'Phạm Văn D', email: 'phamvand@example.com', percentage: 35, phone: '0934567890' },
        { name: 'Hoàng Thị E', email: 'hoangthie@example.com', percentage: 30, phone: '0945678901' },
        { name: 'Vũ Văn F', email: 'vuvanf@example.com', percentage: 20, phone: '0956789012' }
      ],
      insurance: {
        provider: 'Prudential',
        policyNumber: 'PRU-2024-005678',
        startDate: '2024-03-20',
        endDate: '2025-03-20',
        premium: 3200000,
        coverage: 'Cơ bản',
        deductible: 300000,
        monthlyPayment: 266667,
        nextPayment: '2024-12-20',
        status: 'Active'
      }
    },
    {
      id: 3,
      vehicleName: 'VinFast VF8',
      licensePlate: '30C-11111',
      ownershipPercentage: 20,
      purchaseDate: '2024-06-10',
      status: 'Maintenance',
      monthlyCost: 2200000,
      nextPayment: '2024-12-10',
      coOwners: [
        { name: 'John Doe', email: 'john.doe@example.com', percentage: 20, phone: '0123456789' },
        { name: 'Đặng Văn G', email: 'dangvang@example.com', percentage: 25, phone: '0967890123' },
        { name: 'Bùi Thị H', email: 'buithih@example.com', percentage: 30, phone: '0978901234' },
        { name: 'Đinh Văn I', email: 'dinhvani@example.com', percentage: 25, phone: '0989012345' }
      ],
      insurance: {
        provider: 'Bảo Minh',
        policyNumber: 'BM-2024-009012',
        startDate: '2024-06-10',
        endDate: '2025-06-10',
        premium: 3800000,
        coverage: 'Toàn diện',
        deductible: 400000,
        monthlyPayment: 316667,
        nextPayment: '2024-12-10',
        status: 'Active'
      }
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving EV co-ownership member profile:', form);
    // You can add API call here to save the member profile data
    alert('Thông tin thành viên đã được lưu thành công!');
  };

  // Handle ID card file selection -> convert to data URL for preview
  const handleIdCardChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUser(prev => ({ ...prev, idCardImageUrl: reader.result }));
    };
    reader.onerror = () => {
      alert('Đã xảy ra lỗi khi đọc file. Vui lòng thử lại.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveIdCard = () => {
    setUser(prev => ({ ...prev, idCardImageUrl: null }));
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleViewCoOwners = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowCoOwnersModal(true);
  };

  const closeModal = () => {
    setShowCoOwnersModal(false);
    setSelectedVehicle(null);
  };

  const handleViewAgreement = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowAgreementModal(true);
  };

  const closeAgreementModal = () => {
    setShowAgreementModal(false);
    setSelectedVehicle(null);
  };

  // const handleViewInsurance = (vehicle) => {
  //   setSelectedVehicle(vehicle);
  //   setShowInsuranceModal(true);
  // };

  const closeInsuranceModal = () => {
    setShowInsuranceModal(false);
    setSelectedVehicle(null);
  };

  const handlePrintAgreement = () => {
    window.print();
  };

  // Chỉ hiển thị Header cho member role (role = 0)
  const isMember = userRole === 0 || userRole === '0' || Number(userRole) === 0;

  return (
    <div className="w-full">
      {isMember && <Header/>}
      <div className="rounded-lg bg-white p-6">
        <h2 className="text-4xl font-bold text-indigo-900 mb-6">Thông tin thành viên EV Co-ownership</h2>

        <div className="flex border-b-2 border-indigo-100 mb-10">
          <div
            className={`py-2 font-semibold cursor-pointer mr-8 text-[16px] tracking-wider transition-all ${
              activeTab === 'profile' 
                ? 'text-indigo-900 border-b-3 border-indigo-900' 
                : 'text-indigo-600 hover:text-indigo-800'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            HỒ SƠ
          </div>
          <div
            className={`py-2 font-semibold cursor-pointer mr-8 text-[16px] tracking-wider transition-all ${
              activeTab === 'vehicles' 
                ? 'text-indigo-900 border-b-3 border-indigo-900' 
                : 'text-indigo-600 hover:text-indigo-800'
            }`}
            onClick={() => setActiveTab('vehicles')}
          >
            SỞ HỮU XE
          </div>
          <div
            className={`py-2 font-semibold cursor-pointer mr-8 text-[16px] tracking-wider transition-all ${
              activeTab === 'insurance' 
                ? 'text-indigo-900 border-b-3 border-indigo-900' 
                : 'text-indigo-600 hover:text-indigo-800'
            }`}
            onClick={() => setActiveTab('insurance')}
          >
            BẢO HIỂM
          </div>
          <div
            className={`py-2 font-semibold cursor-pointer mr-8 text-[16px] tracking-wider transition-all ${
              activeTab === 'votes' 
                ? 'text-indigo-900 border-b-3 border-indigo-900' 
                : 'text-indigo-600 hover:text-indigo-800'
            }`}
            onClick={() => setActiveTab('votes')}
          >
            ĐÁNH GIÁ
          </div>
        </div>

        {activeTab === 'profile' && user && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Side - Avatar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    {/* <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                      {user.avatarImageUrl ? (
                        <img
                          src={user.avatarImageUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-3xl">
                          {form.name ? form.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button> */}
                  </div>
                </div>

                {/* Name */}
                {/* <h3 className="text-gray-900 text-xl font-bold">
                  {form.name || form.fullName || 'Chưa cập nhật'}
                </h3> */}

                {/* ID card upload placed under the name */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Ảnh căn cước</p>
                  <div className="mx-auto w-48">
                    {user.idCardImageUrl ? (
                      <img
                        src={user.idCardImageUrl}
                        alt="Ảnh căn cước"
                        className="w-full h-auto rounded-md border border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-md border border-gray-200 shadow-sm flex items-center justify-center">
                        <span className="text-gray-400">Chưa có ảnh căn cước</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex justify-center space-x-2">
                    <label className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white rounded cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={handleIdCardChange} />
                      Tải ảnh
                    </label>
                    {user.idCardImageUrl && (
                      <button onClick={handleRemoveIdCard} className="px-3 py-1 border rounded">Xóa</button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="space-y-6">
                  {/* Row 1: Họ và Tên + Email */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 text-left">HỌ VÀ TÊN</label>
                      <input
                        name="name"
                        value={form.name || form.fullName || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 text-left">EMAIL</label>
                      <input
                        name="email"
                        value={user.email}
                        readOnly
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Row 2: Số điện thoại + Giới tính */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 text-left">SỐ ĐIỆN THOẠI</label>
                      <input
                        name="phone"
                        value={form.phone || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 text-left">GIỚI TÍNH</label>
                      <select
                        name="gender"
                        value={form.gender || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Ngày sinh + Địa chỉ */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 text-left">NGÀY SINH</label>
                      <input
                        name="dob"
                        type="date"
                        value={form.dob || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 text-left">ĐỊA CHỈ</label>
                      <input
                        name="address"
                        value={form.address || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập địa chỉ thường trú"
                      />
                    </div>
                  </div>

                  {/* Row 4: Bằng lái xe */}
                  <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 text-left">BẰNG LÁI XE</label>
                    <input
                      name="licenseNumber"
                      value={form.licenseNumber || ''}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập bằng lái xe"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleSave}
                      className="px-12 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      LƯU
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="mb-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Tên xe</th>
                    <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Biển số</th>
                    <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">% Sở hữu</th>
                    <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Ngày sỡ hữu</th>
                    <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Trạng thái</th>
                    <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleData.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                      <td className="border border-indigo-200 px-4 py-3">
                        <div className="font-medium text-gray-900">{vehicle.vehicleName}</div>
                      </td>
                      <td className="border border-indigo-200 px-4 py-3">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">
                          {vehicle.licensePlate}
                        </span>
                      </td>
                      <td className="border border-indigo-200 px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${vehicle.ownershipPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{vehicle.ownershipPercentage}%</span>
                        </div>
                      </td>
                      <td className="border border-indigo-200 px-4 py-3 text-gray-700">
                        {new Date(vehicle.purchaseDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="border border-indigo-200 px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vehicle.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {vehicle.status === 'Active' ? 'Hoạt động' : 'Bảo trì'}
                        </span>
                      </td>
                      <td className="border border-indigo-200 px-4 py-3">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewCoOwners(vehicle)}
                            className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                            title="Xem đồng sở hữu"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleViewAgreement(vehicle)}
                            className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                            title="Xem bảng hợp đồng sở hữu"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'insurance' && (
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {vehicleData.map((vehicle) => (
                <div key={vehicle.id} className="bg-white border border-indigo-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-indigo-900">{vehicle.vehicleName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vehicle.insurance.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.insurance.status === 'Active' ? 'Hoạt động' : 'Hết hạn'}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Nhà bảo hiểm:</span>
                        <span className="text-sm font-medium text-gray-900">{vehicle.insurance.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Số hợp đồng:</span>
                        <span className="text-sm font-medium text-gray-900">{vehicle.insurance.policyNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Loại bảo hiểm:</span>
                        <span className="text-sm font-medium text-gray-900">{vehicle.insurance.coverage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phí bảo hiểm/năm:</span>
                        <span className="text-sm font-bold text-indigo-900">
                          {vehicle.insurance.premium.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phần của bạn:</span>
                        <span className="text-sm font-bold text-red-600">
                          {Math.round(vehicle.insurance.monthlyPayment * vehicle.ownershipPercentage / 100).toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Hạn thanh toán tiếp:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(vehicle.insurance.nextPayment).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hiệu lực:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(vehicle.insurance.startDate).toLocaleDateString('vi-VN')} - {new Date(vehicle.insurance.endDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <button 
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-sm text-sm font-medium transition-colors"
                      >
                        Thanh toán
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'votes' && (
          <div className="mb-8">
            {/* Mock votes - có thể thay bằng API */}
            <VoteList />
          </div>
        )}

        {/* Co-owners Modal */}
        {showCoOwnersModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-indigo-900">
                    Đồng sở hữu - {selectedVehicle.vehicleName}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-indigo-600 font-medium">Biển số xe</p>
                      <p className="text-lg font-bold text-indigo-900">{selectedVehicle.licensePlate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-indigo-600 font-medium">Tổng sở hữu</p>
                      <p className="text-lg font-bold text-indigo-900">
                        {selectedVehicle.coOwners.reduce((sum, owner) => sum + owner.percentage, 0)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Danh sách đồng sở hữu</h4>
                  {selectedVehicle.coOwners.map((owner, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold text-sm">
                                {owner.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900">{owner.name}</h5>
                              <p className="text-sm text-gray-600">{owner.email}</p>
                              <p className="text-sm text-gray-500">{owner.phone}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full" 
                                style={{ width: `${owner.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-lg font-bold text-indigo-900 min-w-[3rem]">
                              {owner.percentage}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {owner.percentage === selectedVehicle.ownershipPercentage ? '(Bạn)' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Co-ownership Agreement Modal */}
        {showAgreementModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-indigo-900">
                    Bảng hợp đồng sở hữu - {selectedVehicle.vehicleName}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePrintAgreement}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      <span>In</span>
                    </button>
                    <button
                      onClick={closeAgreementModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Agreement Header */}
                <div className="mb-6 text-center border-b-2 border-indigo-200 pb-4">
                  <h1 className="text-3xl font-bold text-indigo-900 mb-2">HỢP ĐỒNG SỞ HỮU CHUNG XE ĐIỆN</h1>
                  <p className="text-lg text-gray-700">Thỏa thuận về quyền sở hữu và sử dụng xe điện</p>
                </div>

                {/* Vehicle Information */}
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-indigo-900 mb-3">Thông tin xe</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-indigo-600 font-medium">Tên xe</p>
                      <p className="text-lg font-bold text-indigo-900">{selectedVehicle.vehicleName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-600 font-medium">Biển số xe</p>
                      <p className="text-lg font-bold text-indigo-900">{selectedVehicle.licensePlate}</p>
                    </div>
                  </div>
                </div>

                {/* Co-ownership Table */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-indigo-900 mb-3">Bảng phân chia quyền sở hữu</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-lg shadow-md">
                      <thead>
                        <tr className="bg-indigo-50">
                          <th className="border border-indigo-200 px-4 py-3 text-left font-semibold text-indigo-900">STT</th>
                          <th className="border border-indigo-200 px-4 py-3 text-left font-semibold text-indigo-900">Họ và tên</th>
                          <th className="border border-indigo-200 px-4 py-3 text-left font-semibold text-indigo-900">Email</th>
                          <th className="border border-indigo-200 px-4 py-3 text-left font-semibold text-indigo-900">Số điện thoại</th>
                          <th className="border border-indigo-200 px-4 py-3 text-left font-semibold text-indigo-900">% Sở hữu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedVehicle.coOwners.map((owner, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="border border-indigo-200 px-4 py-3 text-center font-medium">
                              {index + 1}
                            </td>
                            <td className="border border-indigo-200 px-4 py-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                  <span className="text-indigo-600 font-semibold text-xs">
                                    {owner.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </span>
                                </div>
                                <span className="font-medium text-gray-900">{owner.name}</span>
                                {owner.percentage === selectedVehicle.ownershipPercentage && (
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                    (Bạn)
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="border border-indigo-200 px-4 py-3 text-gray-700">
                              {owner.email}
                            </td>
                            <td className="border border-indigo-200 px-4 py-3 text-gray-700">
                              {owner.phone}
                            </td>
                            <td className="border border-indigo-200 px-4 py-3">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-indigo-600 h-2 rounded-full" 
                                    style={{ width: `${owner.percentage}%` }}
                                  ></div>
                                </div>
                                <span className="font-medium text-indigo-900">{owner.percentage}%</span>
                              </div>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Agreement Terms */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-indigo-900 mb-3">Điều khoản thỏa thuận</h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start space-x-2">
                      <span className="font-bold text-indigo-600">1.</span>
                      <p>Mỗi đồng sở hữu có quyền sử dụng xe theo tỷ lệ sở hữu đã thỏa thuận.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="font-bold text-indigo-600">2.</span>
                      <p>Chi phí bảo trì, bảo hiểm và các chi phí khác được phân chia theo tỷ lệ sở hữu.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="font-bold text-indigo-600">3.</span>
                      <p>Việc sử dụng xe phải được thông báo trước cho các đồng sở hữu khác.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="font-bold text-indigo-600">4.</span>
                      <p>Không được chuyển nhượng quyền sở hữu mà không có sự đồng ý của tất cả các bên.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="font-bold text-indigo-600">5.</span>
                      <p>Trong trường hợp có tranh chấp, các bên sẽ giải quyết thông qua thương lượng.</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-indigo-200 pt-4">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div>
                      <p>Ngày lập: {new Date().toLocaleDateString('vi-VN')}</p>
                      <p>Hợp đồng có hiệu lực từ ngày ký</p>
                    </div>
                    <div className="text-right">
                      <p>Tổng số đồng sở hữu: {selectedVehicle.coOwners.length} người</p>
                      <p>Tổng tỷ lệ sở hữu: {selectedVehicle.coOwners.reduce((sum, owner) => sum + owner.percentage, 0)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insurance Details Modal */}
        {showInsuranceModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-indigo-900">
                    Chi tiết bảo hiểm - {selectedVehicle.vehicleName}
                  </h3>
                  <button
                    onClick={closeInsuranceModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Insurance Header */}
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-indigo-600 font-medium">Nhà bảo hiểm</p>
                      <p className="text-lg font-bold text-indigo-900">{selectedVehicle.insurance.provider}</p>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-600 font-medium">Số hợp đồng</p>
                      <p className="text-lg font-bold text-indigo-900">{selectedVehicle.insurance.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-600 font-medium">Loại bảo hiểm</p>
                      <p className="text-lg font-bold text-indigo-900">{selectedVehicle.insurance.coverage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-600 font-medium">Trạng thái</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedVehicle.insurance.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedVehicle.insurance.status === 'Active' ? 'Hoạt động' : 'Hết hạn'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-indigo-900 mb-4">Phân tích chi phí</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Chi phí tổng thể</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Phí bảo hiểm/năm:</span>
                          <span className="text-sm font-bold text-gray-900">
                            {selectedVehicle.insurance.premium.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-bold text-green-600">
                            {Math.round(selectedVehicle.insurance.monthlyPayment).toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Mức khấu trừ:</span>
                          <span className="text-sm font-bold text-orange-600">
                            {selectedVehicle.insurance.deductible.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Chi phí của bạn</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tỷ lệ sở hữu:</span>
                          <span className="text-sm font-bold text-indigo-600">
                            {selectedVehicle.ownershipPercentage}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-bold text-red-600">
                            {Math.round(selectedVehicle.insurance.monthlyPayment * selectedVehicle.ownershipPercentage / 100).toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Chi phí/năm của bạn:</span>
                          <span className="text-sm font-bold text-red-600">
                            {Math.round(selectedVehicle.insurance.premium * selectedVehicle.ownershipPercentage / 100).toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Schedule */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-indigo-900 mb-4">Lịch thanh toán</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Ngày bắt đầu</p>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date(selectedVehicle.insurance.startDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Ngày kết thúc</p>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date(selectedVehicle.insurance.endDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Thanh toán tiếp theo</p>
                        <p className="text-lg font-bold text-indigo-600">
                          {new Date(selectedVehicle.insurance.nextPayment).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coverage Details */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-indigo-900 mb-4">Chi tiết bảo hiểm</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Bảo hiểm thân vỏ</span>
                        <span className="text-sm font-medium text-green-600">✓ Có</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Bảo hiểm trách nhiệm dân sự</span>
                        <span className="text-sm font-medium text-green-600">✓ Có</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Bảo hiểm tai nạn người ngồi trên xe</span>
                        <span className="text-sm font-medium text-green-600">✓ Có</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Bảo hiểm cháy nổ</span>
                        <span className="text-sm font-medium text-green-600">✓ Có</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">Bảo hiểm kéo xe</span>
                        <span className="text-sm font-medium text-green-600">✓ Có</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeInsuranceModal}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Đóng
                  </button>
                  <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
                    Thanh toán ngay
                  </button>
                  <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm">
                    Tải hợp đồng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

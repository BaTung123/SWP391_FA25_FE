import React, { useState } from 'react';

const RegistercarPage = () => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    destination: '',
    estimatedDistance: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Sample vehicle data (in real app, this would come from API)
  const availableVehicles = [
    { id: 1, name: 'Tesla Model 3', licensePlate: '30A-12345', status: 'Available' },
    { id: 2, name: 'BYD Atto 3', licensePlate: '29B-67890', status: 'Available' },
    { id: 3, name: 'VinFast VF8', licensePlate: '30C-11111', status: 'Maintenance' }
  ];

  // Appointment scheduling templates
  const schedulingTemplates = [
    {
      id: 'morning_commute',
      name: 'Đi làm buổi sáng',
      icon: '🌅',
      description: '8:00 - 9:00, Thứ 2-6',
      purpose: 'business',
      startTime: '08:00',
      endTime: '09:00',
      estimatedDistance: '15',
      notes: 'Đi làm buổi sáng'
    },
    {
      id: 'evening_commute',
      name: 'Về nhà buổi tối',
      icon: '🌆',
      description: '17:30 - 18:30, Thứ 2-6',
      purpose: 'business',
      startTime: '17:30',
      endTime: '18:30',
      estimatedDistance: '15',
      notes: 'Về nhà buổi tối'
    },
    {
      id: 'weekend_family',
      name: 'Cuối tuần gia đình',
      icon: '👨‍👩‍👧‍👦',
      description: '9:00 - 18:00, Thứ 7-CN',
      purpose: 'family',
      startTime: '09:00',
      endTime: '18:00',
      estimatedDistance: '50',
      notes: 'Đi chơi cuối tuần cùng gia đình'
    },
    {
      id: 'shopping_trip',
      name: 'Đi mua sắm',
      icon: '🛒',
      description: '2-3 giờ',
      purpose: 'personal',
      startTime: '14:00',
      endTime: '17:00',
      estimatedDistance: '25',
      notes: 'Đi mua sắm tại trung tâm thương mại'
    },
    {
      id: 'emergency_medical',
      name: 'Khẩn cấp y tế',
      icon: '🏥',
      description: 'Ngay lập tức',
      purpose: 'emergency',
      startTime: '00:00',
      endTime: '23:59',
      estimatedDistance: '10',
      notes: 'Khẩn cấp y tế'
    },
    {
      id: 'business_meeting',
      name: 'Họp công việc',
      icon: '💼',
      description: '2-4 giờ',
      purpose: 'business',
      startTime: '10:00',
      endTime: '14:00',
      estimatedDistance: '30',
      notes: 'Họp khách hàng'
    },
    {
      id: 'airport_pickup',
      name: 'Đón sân bay',
      icon: '✈️',
      description: '3-4 giờ',
      purpose: 'personal',
      startTime: '08:00',
      endTime: '12:00',
      estimatedDistance: '60',
      notes: 'Đón người thân tại sân bay'
    },
    {
      id: 'gym_workout',
      name: 'Tập gym',
      icon: '💪',
      description: '1.5-2 giờ',
      purpose: 'personal',
      startTime: '19:00',
      endTime: '21:00',
      estimatedDistance: '8',
      notes: 'Tập gym buổi tối'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
    setFormData(prev => ({
      ...prev,
      purpose: template.purpose,
      startTime: template.startTime,
      endTime: template.endTime,
      estimatedDistance: template.estimatedDistance,
      notes: template.notes
    }));
  };

  const clearTemplate = () => {
    setSelectedTemplate('');
    setFormData(prev => ({
      ...prev,
      purpose: '',
      startTime: '',
      endTime: '',
      estimatedDistance: '',
      notes: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Car registration submitted:', formData);
      alert('Đăng ký lịch sử dụng xe thành công!');
      
      // Reset form
      setFormData({
        vehicleId: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
        destination: '',
        estimatedDistance: '',
        notes: ''
      });
      setSelectedTemplate('');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-900 mb-2">
              Đăng Ký Lịch Sử Dụng Xe Đồng Sở Hữu
            </h1>
            <p className="text-gray-600">
              Đăng ký lịch sử dụng xe điện trong hệ thống đồng sở hữu
            </p>
          </div>

          {/* Scheduling Templates */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-indigo-900 mb-4">
              Mẫu lịch sử dụng phổ biến
            </h3>
            <p className="text-gray-600 mb-4">
              Chọn một mẫu có sẵn để điền nhanh thông tin, hoặc để trống để tự nhập
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {schedulingTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedTemplate === template.id
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-25'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{template.icon}</span>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {template.name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>

            {selectedTemplate && (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-800 font-medium">
                    Đã chọn mẫu: {schedulingTemplates.find(t => t.id === selectedTemplate)?.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearTemplate}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Xóa mẫu
                </button>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chọn xe <span className="text-red-500">*</span>
                </label>
                <select
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  <option value="">-- Chọn xe --</option>
                  {availableVehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} - {vehicle.licensePlate} ({vehicle.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mục đích sử dụng <span className="text-red-500">*</span>
                  {selectedTemplate && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Từ mẫu
                    </span>
                  )}
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  <option value="">-- Chọn mục đích --</option>
                  <option value="personal">Cá nhân</option>
                  <option value="business">Công việc</option>
                  <option value="family">Gia đình</option>
                  <option value="emergency">Khẩn cấp</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={getMinDate()}
                  required
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày kết thúc <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || getMinDate()}
                  required
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giờ bắt đầu <span className="text-red-500">*</span>
                  {selectedTemplate && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Từ mẫu
                    </span>
                  )}
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giờ kết thúc <span className="text-red-500">*</span>
                  {selectedTemplate && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Từ mẫu
                    </span>
                  )}
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Destination and Distance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Điểm đến
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Nhập địa điểm đến"
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quãng đường dự kiến (km)
                  {selectedTemplate && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Từ mẫu
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  name="estimatedDistance"
                  value={formData.estimatedDistance}
                  onChange={handleChange}
                  placeholder="Nhập quãng đường"
                  min="0"
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ghi chú thêm
                {selectedTemplate && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Từ mẫu
                  </span>
                )}
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Nhập ghi chú thêm (nếu có)..."
                className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Vui lòng đăng ký trước ít nhất 2 giờ</li>
                    <li>Chi phí sử dụng sẽ được tính theo thời gian thực tế</li>
                    <li>Trả xe đúng giờ để tránh ảnh hưởng đến lịch của người khác</li>
                    <li>Liên hệ hotline nếu có thay đổi hoặc hủy lịch</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </div>
                ) : (
                  'Đăng Ký Lịch Sử Dụng'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistercarPage;


// import React, { useState } from 'react';

// const RegistercarPage = () => {
//   const [formData, setFormData] = useState({
//     vehicleId: '',
//     startDate: '',
//     endDate: '',
//     startTime: '',
//     endTime: '',
//     purpose: '',
//     destination: '',
//     estimatedDistance: '',
//     notes: ''
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState('');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedStartDate, setSelectedStartDate] = useState(null);
//   const [selectedEndDate, setSelectedEndDate] = useState(null);

//   // Sample vehicle data (in real app, this would come from API)
//   const availableVehicles = [
//     { id: 1, name: 'Tesla Model 3', licensePlate: '30A-12345', status: 'Available' },
//     { id: 2, name: 'BYD Atto 3', licensePlate: '29B-67890', status: 'Available' },
//     { id: 3, name: 'VinFast VF8', licensePlate: '30C-11111', status: 'Maintenance' }
//   ];

//   // Appointment scheduling templates
//   const schedulingTemplates = [
//     {
//       id: 'morning_commute',
//       name: 'Đi làm buổi sáng',
//       icon: '🌅',
//       description: '8:00 - 9:00, Thứ 2-6',
//       purpose: 'business',
//       startTime: '08:00',
//       endTime: '09:00',
//       estimatedDistance: '15',
//       notes: 'Đi làm buổi sáng'
//     },
//     {
//       id: 'evening_commute',
//       name: 'Về nhà buổi tối',
//       icon: '🌆',
//       description: '17:30 - 18:30, Thứ 2-6',
//       purpose: 'business',
//       startTime: '17:30',
//       endTime: '18:30',
//       estimatedDistance: '15',
//       notes: 'Về nhà buổi tối'
//     },
//     {
//       id: 'weekend_family',
//       name: 'Cuối tuần gia đình',
//       icon: '👨‍👩‍👧‍👦',
//       description: '9:00 - 18:00, Thứ 7-CN',
//       purpose: 'family',
//       startTime: '09:00',
//       endTime: '18:00',
//       estimatedDistance: '50',
//       notes: 'Đi chơi cuối tuần cùng gia đình'
//     },
//     {
//       id: 'shopping_trip',
//       name: 'Đi mua sắm',
//       icon: '🛒',
//       description: '2-3 giờ',
//       purpose: 'personal',
//       startTime: '14:00',
//       endTime: '17:00',
//       estimatedDistance: '25',
//       notes: 'Đi mua sắm tại trung tâm thương mại'
//     },
//     {
//       id: 'emergency_medical',
//       name: 'Khẩn cấp y tế',
//       icon: '🏥',
//       description: 'Ngay lập tức',
//       purpose: 'emergency',
//       startTime: '00:00',
//       endTime: '23:59',
//       estimatedDistance: '10',
//       notes: 'Khẩn cấp y tế'
//     },
//     {
//       id: 'business_meeting',
//       name: 'Họp công việc',
//       icon: '💼',
//       description: '2-4 giờ',
//       purpose: 'business',
//       startTime: '10:00',
//       endTime: '14:00',
//       estimatedDistance: '30',
//       notes: 'Họp khách hàng'
//     },
//     {
//       id: 'airport_pickup',
//       name: 'Đón sân bay',
//       icon: '✈️',
//       description: '3-4 giờ',
//       purpose: 'personal',
//       startTime: '08:00',
//       endTime: '12:00',
//       estimatedDistance: '60',
//       notes: 'Đón người thân tại sân bay'
//     },
//     {
//       id: 'gym_workout',
//       name: 'Tập gym',
//       icon: '💪',
//       description: '1.5-2 giờ',
//       purpose: 'personal',
//       startTime: '19:00',
//       endTime: '21:00',
//       estimatedDistance: '8',
//       notes: 'Tập gym buổi tối'
//     }
//   ];

//   // Vietnamese month names
//   const monthNames = [
//     'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
//     'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
//   ];

//   // Vietnamese day names
//   const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

//   const getDaysInMonth = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDayOfWeek = firstDay.getDay();

//     const days = [];
    
//     // Add empty cells for days before the first day of the month
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }
    
//     // Add all days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       days.push(day);
//     }
    
//     return days;
//   };

//   const goToPreviousMonth = () => {
//     setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
//   };

//   const goToNextMonth = () => {
//     setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
//   };

//   const goToToday = () => {
//     setCurrentDate(new Date());
//   };

//   const handleDateClick = (day) => {
//     if (!day) return;
    
//     const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     // Don't allow selection of past dates
//     if (clickedDate < today) return;
    
//     if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
//       // Start new selection
//       setSelectedStartDate(clickedDate);
//       setSelectedEndDate(null);
//       setFormData(prev => ({
//         ...prev,
//         startDate: clickedDate.toISOString().split('T')[0],
//         endDate: ''
//       }));
//     } else if (selectedStartDate && !selectedEndDate) {
//       // Complete the selection
//       if (clickedDate >= selectedStartDate) {
//         setSelectedEndDate(clickedDate);
//         setFormData(prev => ({
//           ...prev,
//           endDate: clickedDate.toISOString().split('T')[0]
//         }));
//       } else {
//         // If clicked date is before start date, make it the new start date
//         setSelectedStartDate(clickedDate);
//         setSelectedEndDate(null);
//         setFormData(prev => ({
//           ...prev,
//           startDate: clickedDate.toISOString().split('T')[0],
//           endDate: ''
//         }));
//       }
//     }
//   };

//   const isToday = (day) => {
//     if (!day) return false;
//     const today = new Date();
//     return (
//       day === today.getDate() &&
//       currentDate.getMonth() === today.getMonth() &&
//       currentDate.getFullYear() === today.getFullYear()
//     );
//   };

//   const isSelected = (day) => {
//     if (!day) return false;
//     const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
//     if (selectedStartDate && selectedEndDate) {
//       return clickedDate >= selectedStartDate && clickedDate <= selectedEndDate;
//     } else if (selectedStartDate) {
//       return clickedDate.getTime() === selectedStartDate.getTime();
//     }
//     return false;
//   };

//   const isStartDate = (day) => {
//     if (!day || !selectedStartDate) return false;
//     const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//     return clickedDate.getTime() === selectedStartDate.getTime();
//   };

//   const isEndDate = (day) => {
//     if (!day || !selectedEndDate) return false;
//     const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//     return clickedDate.getTime() === selectedEndDate.getTime();
//   };

//   const isPastDate = (day) => {
//     if (!day) return false;
//     const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return clickedDate < today;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleTemplateSelect = (template) => {
//     setSelectedTemplate(template.id);
//     setFormData(prev => ({
//       ...prev,
//       purpose: template.purpose,
//       startTime: template.startTime,
//       endTime: template.endTime,
//       estimatedDistance: template.estimatedDistance,
//       notes: template.notes
//     }));
//   };

//   const clearTemplate = () => {
//     setSelectedTemplate('');
//     setFormData(prev => ({
//       ...prev,
//       purpose: '',
//       startTime: '',
//       endTime: '',
//       estimatedDistance: '',
//       notes: ''
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       console.log('Car registration submitted:', formData);
//       alert('Đăng ký lịch sử dụng xe thành công!');
      
//       // Reset form
//       setFormData({
//         vehicleId: '',
//         startDate: '',
//         endDate: '',
//         startTime: '',
//         endTime: '',
//         purpose: '',
//         destination: '',
//         estimatedDistance: '',
//         notes: ''
//       });
//       setSelectedTemplate('');
//       setSelectedStartDate(null);
//       setSelectedEndDate(null);
//     } catch (error) {
//       console.error('Registration error:', error);
//       alert('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getMinDate = () => {
//     return new Date().toISOString().split('T')[0];
//   };

//   const getMinTime = () => {
//     const now = new Date();
//     return now.toTimeString().slice(0, 5);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow-md p-8">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-indigo-900 mb-2">
//               Đăng Ký Lịch Sử Dụng Xe Đồng Sở Hữu
//             </h1>
//             <p className="text-gray-600">
//               Đăng ký lịch sử dụng xe điện trong hệ thống đồng sở hữu
//             </p>
//           </div>

//           {/* Scheduling Templates */}
//           <div className="mb-8">
//             <h3 className="text-xl font-semibold text-indigo-900 mb-4">
//               Mẫu lịch sử dụng phổ biến
//             </h3>
//             <p className="text-gray-600 mb-4">
//               Chọn một mẫu có sẵn để điền nhanh thông tin, hoặc để trống để tự nhập
//             </p>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//               {schedulingTemplates.map((template) => (
//                 <button
//                   key={template.id}
//                   type="button"
//                   onClick={() => handleTemplateSelect(template)}
//                   className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
//                     selectedTemplate === template.id
//                       ? 'border-indigo-500 bg-indigo-50 shadow-md'
//                       : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-25'
//                   }`}
//                 >
//                   <div className="flex items-center mb-2">
//                     <span className="text-2xl mr-2">{template.icon}</span>
//                     <h4 className="font-semibold text-gray-900 text-sm">
//                       {template.name}
//                     </h4>
//                   </div>
//                   <p className="text-xs text-gray-600">
//                     {template.description}
//                   </p>
//                 </button>
//               ))}
//             </div>

//             {selectedTemplate && (
//               <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
//                 <div className="flex items-center">
//                   <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   <span className="text-green-800 font-medium">
//                     Đã chọn mẫu: {schedulingTemplates.find(t => t.id === selectedTemplate)?.name}
//                   </span>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={clearTemplate}
//                   className="text-green-600 hover:text-green-800 text-sm font-medium"
//                 >
//                   Xóa mẫu
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Vehicle Selection */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Chọn xe <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="vehicleId"
//                   value={formData.vehicleId}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//                 >
//                   <option value="">-- Chọn xe --</option>
//                   {availableVehicles.map(vehicle => (
//                     <option key={vehicle.id} value={vehicle.id}>
//                       {vehicle.name} - {vehicle.licensePlate} ({vehicle.status})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Mục đích sử dụng <span className="text-red-500">*</span>
//                   {selectedTemplate && (
//                     <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
//                       Từ mẫu
//                     </span>
//                   )}
//                 </label>
//                 <select
//                   name="purpose"
//                   value={formData.purpose}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//                 >
//                   <option value="">-- Chọn mục đích --</option>
//                   <option value="personal">Cá nhân</option>
//                   <option value="business">Công việc</option>
//                   <option value="family">Gia đình</option>
//                   <option value="emergency">Khẩn cấp</option>
//                   <option value="other">Khác</option>
//                 </select>
//               </div>
//             </div>

//             {/* Calendar Date Selection */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-4">
//                 Chọn ngày sử dụng <span className="text-red-500">*</span>
//               </label>
              
//               {/* Calendar Navigation */}
//               <div className="flex items-center justify-between mb-4">
//                 <button
//                   type="button"
//                   onClick={goToPreviousMonth}
//                   className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                   title="Tháng trước"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                 </button>
                
//                 <div className="text-center">
//                   <h3 className="text-xl font-bold text-indigo-900">
//                     {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
//                   </h3>
//                   <button
//                     type="button"
//                     onClick={goToToday}
//                     className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
//                   >
//                     Hôm nay
//                   </button>
//                 </div>
                
//                 <button
//                   type="button"
//                   onClick={goToNextMonth}
//                   className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                   title="Tháng sau"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </div>

//               {/* Calendar Grid */}
//               <div className="bg-white border border-gray-200 rounded-lg p-4">
//                 {/* Day Headers */}
//                 <div className="grid grid-cols-7 gap-1 mb-2">
//                   {dayNames.map((day) => (
//                     <div
//                       key={day}
//                       className="p-2 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider"
//                     >
//                       {day}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Calendar Days */}
//                 <div className="grid grid-cols-7 gap-1">
//                   {getDaysInMonth(currentDate).map((day, index) => (
//                     <button
//                       key={index}
//                       type="button"
//                       onClick={() => handleDateClick(day)}
//                       disabled={isPastDate(day)}
//                       className={`relative p-3 min-h-[50px] border border-gray-100 transition-all duration-200 ${
//                         day
//                           ? isPastDate(day)
//                             ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                             : 'hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer'
//                           : 'bg-gray-50'
//                       } ${
//                         isToday(day)
//                           ? 'bg-indigo-100 border-indigo-300 text-indigo-900 font-bold'
//                           : ''
//                       } ${
//                         isSelected(day)
//                           ? 'bg-indigo-200 border-indigo-400 text-indigo-900 font-semibold'
//                           : ''
//                       } ${
//                         isStartDate(day) || isEndDate(day)
//                           ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-300'
//                           : ''
//                       }`}
//                     >
//                       {day && (
//                         <span className="text-sm">
//                           {day}
//                         </span>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Selected Dates Display */}
//               {(selectedStartDate || selectedEndDate) && (
//                 <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                       <div className="flex items-center">
//                         <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
//                         <span className="text-sm font-medium text-indigo-900">
//                           Ngày bắt đầu: {selectedStartDate ? selectedStartDate.toLocaleDateString('vi-VN') : 'Chưa chọn'}
//                         </span>
//                       </div>
//                       <div className="flex items-center">
//                         <div className="w-3 h-3 bg-indigo-400 rounded-full mr-2"></div>
//                         <span className="text-sm font-medium text-indigo-900">
//                           Ngày kết thúc: {selectedEndDate ? selectedEndDate.toLocaleDateString('vi-VN') : 'Chưa chọn'}
//                         </span>
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSelectedStartDate(null);
//                         setSelectedEndDate(null);
//                         setFormData(prev => ({
//                           ...prev,
//                           startDate: '',
//                           endDate: ''
//                         }));
//                       }}
//                       className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
//                     >
//                       Xóa lựa chọn
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Calendar Legend */}
//               <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
//                 <h4 className="text-sm font-semibold text-gray-700 mb-2">Chú thích:</h4>
//                 <div className="grid grid-cols-2 gap-2 text-xs">
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 bg-indigo-100 border border-indigo-300 rounded mr-2"></div>
//                     <span className="text-gray-600">Hôm nay</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 bg-indigo-200 border border-indigo-400 rounded mr-2"></div>
//                     <span className="text-gray-600">Đã chọn</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 bg-indigo-600 rounded mr-2"></div>
//                     <span className="text-gray-600">Ngày bắt đầu/kết thúc</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-2"></div>
//                     <span className="text-gray-600">Ngày đã qua</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Time Selection */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Giờ bắt đầu <span className="text-red-500">*</span>
//                   {selectedTemplate && (
//                     <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
//                       Từ mẫu
//                     </span>
//                   )}
//                 </label>
//                 <input
//                   type="time"
//                   name="startTime"
//                   value={formData.startTime}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Giờ kết thúc <span className="text-red-500">*</span>
//                   {selectedTemplate && (
//                     <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
//                       Từ mẫu
//                     </span>
//                   )}
//                 </label>
//                 <input
//                   type="time"
//                   name="endTime"
//                   value={formData.endTime}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//                 />
//               </div>
//             </div>

//             {/* Destination and Distance */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Điểm đến
//                 </label>
//                 <input
//                   type="text"
//                   name="destination"
//                   value={formData.destination}
//                   onChange={handleChange}
//                   placeholder="Nhập địa điểm đến"
//                   className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Quãng đường dự kiến (km)
//                   {selectedTemplate && (
//                     <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
//                       Từ mẫu
//                     </span>
//                   )}
//                 </label>
//                 <input
//                   type="number"
//                   name="estimatedDistance"
//                   value={formData.estimatedDistance}
//                   onChange={handleChange}
//                   placeholder="Nhập quãng đường"
//                   min="0"
//                   className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//                 />
//               </div>
//             </div>

//             {/* Notes */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Ghi chú thêm
//                 {selectedTemplate && (
//                   <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
//                     Từ mẫu
//                   </span>
//                 )}
//               </label>
//               <textarea
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 rows={4}
//                 placeholder="Nhập ghi chú thêm (nếu có)..."
//                 className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors resize-none"
//               />
//             </div>

//             {/* Important Notice */}
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//               <div className="flex items-start">
//                 <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                 </svg>
//                 <div className="text-sm text-yellow-800">
//                   <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
//                   <ul className="list-disc list-inside space-y-1">
//                     <li>Vui lòng đăng ký trước ít nhất 2 giờ</li>
//                     <li>Chi phí sử dụng sẽ được tính theo thời gian thực tế</li>
//                     <li>Trả xe đúng giờ để tránh ảnh hưởng đến lịch của người khác</li>
//                     <li>Liên hệ hotline nếu có thay đổi hoặc hủy lịch</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-center pt-4">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
//                   isSubmitting
//                     ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
//                     : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
//                 }`}
//               >
//                 {isSubmitting ? (
//                   <div className="flex items-center">
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Đang xử lý...
//                   </div>
//                 ) : (
//                   'Đăng Ký Lịch Sử Dụng'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegistercarPage;


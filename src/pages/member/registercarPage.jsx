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

//   // const [isSubmitting, setIsSubmitting] = useState(false);
//   // const [selectedTemplate, setSelectedTemplate] = useState('');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDates, setSelectedDates] = useState([]);
//   const [showTimeModal, setShowTimeModal] = useState(false);
//   const [selectedDateForTime, setSelectedDateForTime] = useState(null);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [userOwnershipPercentage] = useState(25); // Example: 25% ownership = 6 hours max per day
//   const [registeredTimeSlots, setRegisteredTimeSlots] = useState({}); // Store registered time slots by date

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
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }
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

//     if (clickedDate < today) return;

//     const dateString = clickedDate.toISOString().split('T')[0];
    
//     // Check if date is already registered
//     if (registeredTimeSlots[dateString]) {
//       // Show existing registered time slots
//       setSelectedDateForTime(clickedDate);
//       setTimeSlots(registeredTimeSlots[dateString]);
//       setShowTimeModal(true);
//     } else {
//       // Open modal for new time selection
//       setSelectedDateForTime(clickedDate);
//       setShowTimeModal(true);
//       setTimeSlots([]);
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
//     const dateString = clickedDate.toISOString().split('T')[0];
//     return selectedDates.includes(dateString);
//   };

//   const isPastDate = (day) => {
//     if (!day) return false;
//     const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return clickedDate < today;
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

//   const addTimeSlot = () => {
//     setTimeSlots(prev => [...prev, { startTime: '', endTime: '' }]);
//   };

//   const roundToNearest15Minutes = (timeString) => {
//     if (!timeString) return '';
//     const [hours, minutes] = timeString.split(':').map(Number);
//     const totalMinutes = hours * 60 + minutes;
//     const roundedMinutes = Math.round(totalMinutes / 15) * 15;
//     const roundedHours = Math.floor(roundedMinutes / 60);
//     const remainingMinutes = roundedMinutes % 60;
//     return `${roundedHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
//   };

//   const calculateDuration = (startTime, endTime) => {
//     if (!startTime || !endTime) return 0;
//     const [startHours, startMinutes] = startTime.split(':').map(Number);
//     const [endHours, endMinutes] = endTime.split(':').map(Number);
//     const startTotalMinutes = startHours * 60 + startMinutes;
//     const endTotalMinutes = endHours * 60 + endMinutes;
//     return (endTotalMinutes - startTotalMinutes) / 60; // Duration in hours
//   };

//   const getMaxDailyHours = () => {
//     return (userOwnershipPercentage / 100) * 24; // Max hours based on ownership percentage
//   };

//   const getTotalSelectedHours = () => {
//     return timeSlots.reduce((total, slot) => {
//       return total + calculateDuration(slot.startTime, slot.endTime);
//     }, 0);
//   };

//   const updateTimeSlot = (index, field, value) => {
//     const roundedValue = roundToNearest15Minutes(value);
//     setTimeSlots(prev => prev.map((slot, i) => 
//       i === index ? { ...slot, [field]: roundedValue } : slot
//     ));
//   };

//   const removeTimeSlot = (index) => {
//     setTimeSlots(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleConfirmTimeSlots = () => {
//     if (timeSlots.length === 0) {
//       alert('Vui lòng thêm ít nhất một khung giờ');
//       return;
//     }

//     // Validate each time slot
//     for (let i = 0; i < timeSlots.length; i++) {
//       const slot = timeSlots[i];
//       if (!slot.startTime || !slot.endTime) {
//         alert(`Vui lòng điền đầy đủ thời gian cho khung giờ ${i + 1}`);
//         return;
//       }

//       const duration = calculateDuration(slot.startTime, slot.endTime);
//       if (duration < 1) {
//         alert(`Khung giờ ${i + 1} phải có thời lượng tối thiểu 1 giờ`);
//         return;
//       }

//       if (duration > getMaxDailyHours()) {
//         alert(`Khung giờ ${i + 1} vượt quá thời lượng tối đa ${getMaxDailyHours()} giờ (${userOwnershipPercentage}% sở hữu)`);
//         return;
//       }
//     }

//     // Check total hours
//     const totalHours = getTotalSelectedHours();
//     if (totalHours > getMaxDailyHours()) {
//       alert(`Tổng thời gian đăng ký (${totalHours.toFixed(2)}h) vượt quá giới hạn ${getMaxDailyHours()}h (${userOwnershipPercentage}% sở hữu)`);
//       return;
//     }

//     const dateString = selectedDateForTime.toISOString().split('T')[0];
    
//     // Store registered time slots
//     setRegisteredTimeSlots(prev => ({
//       ...prev,
//       [dateString]: [...timeSlots]
//     }));
    
//     // Add to selected dates if not already there
//     setSelectedDates(prev => {
//       if (!prev.includes(dateString)) {
//         return [...prev, dateString];
//       }
//       return prev;
//     });
    
//     // Show success alert
//     alert(`Đăng ký thành công cho ngày ${selectedDateForTime.toLocaleDateString('vi-VN')}!\nĐã đăng ký ${timeSlots.length} khung giờ với tổng thời gian ${totalHours.toFixed(2)} giờ.`);
    
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   const handleCancelTimeSlots = () => {
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   const handleCancelRegistration = () => {
//     const dateString = selectedDateForTime.toISOString().split('T')[0];
    
//     // Remove from registered time slots
//     setRegisteredTimeSlots(prev => {
//       const newSlots = { ...prev };
//       delete newSlots[dateString];
//       return newSlots;
//     });
    
//     // Remove from selected dates
//     setSelectedDates(prev => prev.filter(date => date !== dateString));
    
//     // Show confirmation
//     alert(`Đã hủy đăng ký cho ngày ${selectedDateForTime.toLocaleDateString('vi-VN')}`);
    
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pt-24 pb-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-indigo-900 mb-4">
//               Đăng Ký Lịch Sử Dụng Xe Đồng Sở Hữu
//             </h1>
//         </div>

//         {/* Two Separate Forms Layout */}
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
//           {/* Left Form - Vehicle Selection (1/3) */}
//           <div className="bg-white rounded-xl shadow-lg p-8 xl:col-span-1">
//             <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Thông tin đăng ký</h2>
            
//             {/* Vehicle Selection */}
//             <div className="mb-8">
//               <select
//                 name="vehicleId"
//                 value={formData.vehicleId}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-6 py-4 text-lg border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//               >
//                 <option value="">-- Chọn xe --</option>
//                 {availableVehicles.map(vehicle => (
//                   <option key={vehicle.id} value={vehicle.id}>
//                     {vehicle.name} - {vehicle.licensePlate} ({vehicle.status})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Right Form - Calendar (2/3) */}
//           <div className="bg-white rounded-xl shadow-lg p-8 xl:col-span-2">
//             <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Chọn ngày sử dụng</h2>
            
//             {/* Calendar Navigation */}
//             <div className="flex items-center justify-between mb-6">
//               <button
//                 type="button"
//                 onClick={goToPreviousMonth}
//                 className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                 title="Tháng trước"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>

//               <div className="text-center">
//                 <h3 className="text-2xl font-bold text-indigo-900">
//                   {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
//                 </h3>
//                 <button
//                   type="button"
//                   onClick={goToToday}
//                   className="text-base text-indigo-600 hover:text-indigo-800 font-medium"
//                 >
//                   Hôm nay
//                 </button>
//               </div>

//               <button
//                 type="button"
//                 onClick={goToNextMonth}
//                 className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                 title="Tháng sau"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>

//             {/* Calendar Grid */}
//             <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
//               {/* Day Headers */}
//               <div className="grid grid-cols-7 gap-2 mb-4">
//                 {dayNames.map((day) => (
//                   <div
//                     key={day}
//                     className="p-3 text-center text-base font-semibold text-gray-500 uppercase tracking-wider"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>

//               {/* Calendar Days */}
//               <div className="grid grid-cols-7 gap-2">
//                 {getDaysInMonth(currentDate).map((day, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() => handleDateClick(day)}
//                     disabled={isPastDate(day)}
//                     className={`relative p-4 min-h-[60px] border-2 border-gray-100 transition-all duration-200 ${
//                       day
//                         ? isPastDate(day)
//                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           : 'hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer'
//                         : 'bg-gray-50'
//                     } ${
//                       isToday(day)
//                         ? 'bg-green-100 border-green-300 text-green-900 font-bold'
//                         : ''
//                     } ${
//                       isSelected(day)
//                         ? 'bg-green-200 border-green-400 text-green-900 font-semibold'
//                         : ''
//                     }`}
//                   >
//                     {day && (
//                       <span className="text-base">
//                         {day}
//                       </span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Time Selection Modal */}
//         {showTimeModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-2xl font-bold text-indigo-900">
//                   {registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] 
//                     ? `Khung giờ đã đăng ký - ${selectedDateForTime?.toLocaleDateString('vi-VN')}`
//                     : `Chọn khung giờ cho ngày ${selectedDateForTime?.toLocaleDateString('vi-VN')}`
//                   }
//                 </h3>
//                 <button
//                   onClick={handleCancelTimeSlots}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {timeSlots.map((slot, index) => {
//                   const duration = calculateDuration(slot.startTime, slot.endTime);
//                   const isValidDuration = duration >= 1 && duration <= getMaxDailyHours();
//                   const isViewingMode = registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]];
                  
//                   return (
//                     <div key={index} className={`flex items-center space-x-4 p-4 border rounded-lg ${
//                       isValidDuration ? 'border-gray-200' : 'border-red-300 bg-red-50'
//                     } ${isViewingMode ? 'bg-green-50 border-green-200' : ''}`}>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Giờ bắt đầu
//                         </label>
//                         <input
//                           type="time"
//                           value={slot.startTime}
//                           onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
//                           disabled={isViewingMode}
//                           className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none ${
//                             isViewingMode ? 'bg-gray-100 cursor-not-allowed' : ''
//                           }`}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Giờ kết thúc
//                         </label>
//                         <input
//                           type="time"
//                           value={slot.endTime}
//                           onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
//                           disabled={isViewingMode}
//                           className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none ${
//                             isViewingMode ? 'bg-gray-100 cursor-not-allowed' : ''
//                           }`}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Thời lượng
//                         </label>
//                         <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
//                           isViewingMode 
//                             ? 'text-green-600 bg-green-100' 
//                             : isValidDuration 
//                               ? 'text-green-600 bg-green-100' 
//                               : 'text-red-600 bg-red-100'
//                         }`}>
//                           {duration > 0 ? `${duration.toFixed(2)}h` : 'Chưa chọn'}
//                         </div>
//                       </div>
//                       {!isViewingMode && (
//                         <button
//                           onClick={() => removeTimeSlot(index)}
//                           className="text-red-500 hover:text-red-700 p-2"
//                           title="Xóa khung giờ"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       )}
//                     </div>
//                   );
//                 })}

//                 {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                   <button
//                     onClick={addTimeSlot}
//                     className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
//                   >
//                     + Thêm khung giờ
//                   </button>
//                 )}
//               </div>

//               <div className="flex justify-between items-center mt-8">
//                 <div className="text-sm text-gray-600">
//                   <p>Tổng thời gian: <span className="font-semibold text-indigo-600">{getTotalSelectedHours().toFixed(2)}h</span></p>
//                   {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                     <p>Giới hạn: <span className="font-semibold text-gray-700">{getMaxDailyHours()}h</span></p>
//                   )}
//                 </div>
//                 <div className="flex space-x-4">
//                   <button
//                     onClick={registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] 
//                       ? handleCancelRegistration 
//                       : handleCancelTimeSlots}
//                     className={`px-6 py-3 rounded-lg transition-colors ${
//                       registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]]
//                         ? 'bg-red-600 text-white hover:bg-red-700'
//                         : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     {registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] ? 'Hủy đăng ký' : 'Hủy'}
//                   </button>
//                   {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                     <button
//                       onClick={handleConfirmTimeSlots}
//                       disabled={getTotalSelectedHours() === 0 || getTotalSelectedHours() > getMaxDailyHours()}
//                       className={`px-6 py-3 rounded-lg transition-colors ${
//                         getTotalSelectedHours() === 0 || getTotalSelectedHours() > getMaxDailyHours()
//                           ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
//                           : 'bg-indigo-600 text-white hover:bg-indigo-700'
//                       }`}
//                     >
//                       Đăng ký
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//         </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RegistercarPage;












































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

//   // const [isSubmitting, setIsSubmitting] = useState(false);
//   // const [selectedTemplate, setSelectedTemplate] = useState('');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDates, setSelectedDates] = useState([]);
//   const [showTimeModal, setShowTimeModal] = useState(false);
//   const [selectedDateForTime, setSelectedDateForTime] = useState(null);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [userOwnershipPercentage] = useState(25); // Example: 25% ownership = 6 hours max per day
//   const [registeredTimeSlots, setRegisteredTimeSlots] = useState({}); // Store registered time slots by date

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
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }
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

//     if (clickedDate < today) return;

//     const dateString = clickedDate.toISOString().split('T')[0];
    
//     // Check if date is already registered
//     if (registeredTimeSlots[dateString]) {
//       // Show existing registered time slots
//       setSelectedDateForTime(clickedDate);
//       setTimeSlots(registeredTimeSlots[dateString]);
//       setShowTimeModal(true);
//     } else {
//       // Open modal for new time selection
//       setSelectedDateForTime(clickedDate);
//       setShowTimeModal(true);
//       setTimeSlots([]);
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
//     const dateString = clickedDate.toISOString().split('T')[0];
//     return selectedDates.includes(dateString);
//   };

//   const isPastDate = (day) => {
//     if (!day) return false;
//     const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return clickedDate < today;
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

//   const addTimeSlot = () => {
//     setTimeSlots(prev => [...prev, { startTime: '', endTime: '' }]);
//   };

//   const roundToNearest15Minutes = (timeString) => {
//     if (!timeString) return '';
//     const [hours, minutes] = timeString.split(':').map(Number);
//     const totalMinutes = hours * 60 + minutes;
//     const roundedMinutes = Math.round(totalMinutes / 15) * 15;
//     const roundedHours = Math.floor(roundedMinutes / 60);
//     const remainingMinutes = roundedMinutes % 60;
//     return `${roundedHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
//   };

//   const calculateDuration = (startTime, endTime) => {
//     if (!startTime || !endTime) return 0;
//     const [startHours, startMinutes] = startTime.split(':').map(Number);
//     const [endHours, endMinutes] = endTime.split(':').map(Number);
//     const startTotalMinutes = startHours * 60 + startMinutes;
//     const endTotalMinutes = endHours * 60 + endMinutes;
//     return (endTotalMinutes - startTotalMinutes) / 60; // Duration in hours
//   };

//   const getMaxDailyHours = () => {
//     return (userOwnershipPercentage / 100) * 24; // Max hours based on ownership percentage
//   };

//   const getTotalSelectedHours = () => {
//     return timeSlots.reduce((total, slot) => {
//       return total + calculateDuration(slot.startTime, slot.endTime);
//     }, 0);
//   };

//   const updateTimeSlot = (index, field, value) => {
//     const roundedValue = roundToNearest15Minutes(value);
//     setTimeSlots(prev => prev.map((slot, i) => 
//       i === index ? { ...slot, [field]: roundedValue } : slot
//     ));
//   };

//   const removeTimeSlot = (index) => {
//     setTimeSlots(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleConfirmTimeSlots = () => {
//     if (timeSlots.length === 0) {
//       alert('Vui lòng thêm ít nhất một khung giờ');
//       return;
//     }

//     // Validate each time slot
//     for (let i = 0; i < timeSlots.length; i++) {
//       const slot = timeSlots[i];
//       if (!slot.startTime || !slot.endTime) {
//         alert(`Vui lòng điền đầy đủ thời gian cho khung giờ ${i + 1}`);
//         return;
//       }

//       const duration = calculateDuration(slot.startTime, slot.endTime);
//       if (duration < 1) {
//         alert(`Khung giờ ${i + 1} phải có thời lượng tối thiểu 1 giờ`);
//         return;
//       }

//       if (duration > getMaxDailyHours()) {
//         alert(`Khung giờ ${i + 1} vượt quá thời lượng tối đa ${getMaxDailyHours()} giờ (${userOwnershipPercentage}% sở hữu)`);
//         return;
//       }
//     }

//     // Check total hours
//     const totalHours = getTotalSelectedHours();
//     if (totalHours > getMaxDailyHours()) {
//       alert(`Tổng thời gian đăng ký (${totalHours.toFixed(2)}h) vượt quá giới hạn ${getMaxDailyHours()}h (${userOwnershipPercentage}% sở hữu)`);
//       return;
//     }

//     const dateString = selectedDateForTime.toISOString().split('T')[0];
    
//     // Store registered time slots
//     setRegisteredTimeSlots(prev => ({
//       ...prev,
//       [dateString]: [...timeSlots]
//     }));
    
//     // Add to selected dates if not already there
//     setSelectedDates(prev => {
//       if (!prev.includes(dateString)) {
//         return [...prev, dateString];
//       }
//       return prev;
//     });
    
//     // Show success alert
//     alert(`Đăng ký thành công cho ngày ${selectedDateForTime.toLocaleDateString('vi-VN')}!\nĐã đăng ký ${timeSlots.length} khung giờ với tổng thời gian ${totalHours.toFixed(2)} giờ.`);
    
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   const handleCancelTimeSlots = () => {
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   const handleCancelRegistration = () => {
//     const dateString = selectedDateForTime.toISOString().split('T')[0];
    
//     // Remove from registered time slots
//     setRegisteredTimeSlots(prev => {
//       const newSlots = { ...prev };
//       delete newSlots[dateString];
//       return newSlots;
//     });
    
//     // Remove from selected dates
//     setSelectedDates(prev => prev.filter(date => date !== dateString));
    
//     // Show confirmation
//     alert(`Đã hủy đăng ký cho ngày ${selectedDateForTime.toLocaleDateString('vi-VN')}`);
    
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pt-24 pb-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-indigo-900 mb-4">
//               Đăng Ký Lịch Sử Dụng Xe Đồng Sở Hữu
//             </h1>
//         </div>

//         {/* Two Separate Forms Layout */}
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
//           {/* Left Form - Vehicle Selection (1/3) */}
//           <div className="bg-white rounded-xl shadow-lg p-8 xl:col-span-1">
//             <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Thông tin đăng ký</h2>
            
//             {/* Vehicle Selection */}
//             <div className="mb-8">
//               <select
//                 name="vehicleId"
//                 value={formData.vehicleId}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-6 py-4 text-lg border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//               >
//                 <option value="">-- Chọn xe --</option>
//                 {availableVehicles.map(vehicle => (
//                   <option key={vehicle.id} value={vehicle.id}>
//                     {vehicle.name} - {vehicle.licensePlate} ({vehicle.status})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Right Form - Calendar (2/3) */}
//           <div className="bg-white rounded-xl shadow-lg p-8 xl:col-span-2">
//             <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Chọn ngày sử dụng</h2>
            
//             {/* Calendar Navigation */}
//             <div className="flex items-center justify-between mb-6">
//               <button
//                 type="button"
//                 onClick={goToPreviousMonth}
//                 className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                 title="Tháng trước"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>

//               <div className="text-center">
//                 <h3 className="text-2xl font-bold text-indigo-900">
//                   {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
//                 </h3>
//                 <button
//                   type="button"
//                   onClick={goToToday}
//                   className="text-base text-indigo-600 hover:text-indigo-800 font-medium"
//                 >
//                   Hôm nay
//                 </button>
//               </div>

//               <button
//                 type="button"
//                 onClick={goToNextMonth}
//                 className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                 title="Tháng sau"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>

//             {/* Calendar Grid */}
//             <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
//               {/* Day Headers */}
//               <div className="grid grid-cols-7 gap-2 mb-4">
//                 {dayNames.map((day) => (
//                   <div
//                     key={day}
//                     className="p-3 text-center text-base font-semibold text-gray-500 uppercase tracking-wider"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>

//               {/* Calendar Days */}
//               <div className="grid grid-cols-7 gap-2">
//                 {getDaysInMonth(currentDate).map((day, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() => handleDateClick(day)}
//                     disabled={isPastDate(day)}
//                     className={`relative p-4 min-h-[60px] border-2 border-gray-100 transition-all duration-200 ${
//                       day
//                         ? isPastDate(day)
//                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           : 'hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer'
//                         : 'bg-gray-50'
//                     } ${
//                       isToday(day)
//                         ? 'bg-green-100 border-green-300 text-green-900 font-bold'
//                         : ''
//                     } ${
//                       isSelected(day)
//                         ? 'bg-green-200 border-green-400 text-green-900 font-semibold'
//                         : ''
//                     }`}
//                   >
//                     {day && (
//                       <span className="text-base">
//                         {day}
//                       </span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Time Selection Modal */}
//         {showTimeModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-2xl font-bold text-indigo-900">
//                   {registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] 
//                     ? `Khung giờ đã đăng ký - ${selectedDateForTime?.toLocaleDateString('vi-VN')}`
//                     : `Chọn khung giờ cho ngày ${selectedDateForTime?.toLocaleDateString('vi-VN')}`
//                   }
//                 </h3>
//                 <button
//                   onClick={handleCancelTimeSlots}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {timeSlots.map((slot, index) => {
//                   const duration = calculateDuration(slot.startTime, slot.endTime);
//                   const isValidDuration = duration >= 1 && duration <= getMaxDailyHours();
//                   const isViewingMode = registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]];
                  
//                   return (
//                     <div key={index} className={`flex items-center space-x-4 p-4 border rounded-lg ${
//                       isValidDuration ? 'border-gray-200' : 'border-red-300 bg-red-50'
//                     } ${isViewingMode ? 'bg-green-50 border-green-200' : ''}`}>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Giờ bắt đầu
//                         </label>
//                         <input
//                           type="time"
//                           value={slot.startTime}
//                           onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
//                           disabled={isViewingMode}
//                           className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none ${
//                             isViewingMode ? 'bg-gray-100 cursor-not-allowed' : ''
//                           }`}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Giờ kết thúc
//                         </label>
//                         <input
//                           type="time"
//                           value={slot.endTime}
//                           onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
//                           disabled={isViewingMode}
//                           className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none ${
//                             isViewingMode ? 'bg-gray-100 cursor-not-allowed' : ''
//                           }`}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Thời lượng
//                         </label>
//                         <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
//                           isViewingMode 
//                             ? 'text-green-600 bg-green-100' 
//                             : isValidDuration 
//                               ? 'text-green-600 bg-green-100' 
//                               : 'text-red-600 bg-red-100'
//                         }`}>
//                           {duration > 0 ? `${duration.toFixed(2)}h` : 'Chưa chọn'}
//                         </div>
//                       </div>
//                       {!isViewingMode && (
//                         <button
//                           onClick={() => removeTimeSlot(index)}
//                           className="text-red-500 hover:text-red-700 p-2"
//                           title="Xóa khung giờ"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       )}
//                     </div>
//                   );
//                 })}

//                 {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                   <button
//                     onClick={addTimeSlot}
//                     className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
//                   >
//                     + Thêm khung giờ
//                   </button>
//                 )}
//               </div>

//               <div className="flex justify-between items-center mt-8">
//                 <div className="text-sm text-gray-600">
//                   <p>Tổng thời gian: <span className="font-semibold text-indigo-600">{getTotalSelectedHours().toFixed(2)}h</span></p>
//                   {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                     <p>Giới hạn: <span className="font-semibold text-gray-700">{getMaxDailyHours()}h</span></p>
//                   )}
//                 </div>
//                 <div className="flex space-x-4">
//                   <button
//                     onClick={registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] 
//                       ? handleCancelRegistration 
//                       : handleCancelTimeSlots}
//                     className={`px-6 py-3 rounded-lg transition-colors ${
//                       registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]]
//                         ? 'bg-red-600 text-white hover:bg-red-700'
//                         : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     {registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] ? 'Hủy đăng ký' : 'Hủy'}
//                   </button>
//                   {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                     <button
//                       onClick={handleConfirmTimeSlots}
//                       disabled={getTotalSelectedHours() === 0 || getTotalSelectedHours() > getMaxDailyHours()}
//                       className={`px-6 py-3 rounded-lg transition-colors ${
//                         getTotalSelectedHours() === 0 || getTotalSelectedHours() > getMaxDailyHours()
//                           ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
//                           : 'bg-indigo-600 text-white hover:bg-indigo-700'
//                       }`}
//                     >
//                       Đăng ký
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//         </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RegistercarPage;
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

//   // const [isSubmitting, setIsSubmitting] = useState(false);
//   // const [selectedTemplate, setSelectedTemplate] = useState('');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDates, setSelectedDates] = useState([]);
//   const [showTimeModal, setShowTimeModal] = useState(false);
//   const [selectedDateForTime, setSelectedDateForTime] = useState(null);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [userOwnershipPercentage] = useState(25); // Example: 25% ownership = 6 hours max per day
//   const [registeredTimeSlots, setRegisteredTimeSlots] = useState({}); // Store registered time slots by date

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
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }
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

//     if (clickedDate < today) return;

//     const dateString = clickedDate.toISOString().split('T')[0];
    
//     // Check if date is already registered
//     if (registeredTimeSlots[dateString]) {
//       // Show existing registered time slots
//       setSelectedDateForTime(clickedDate);
//       setTimeSlots(registeredTimeSlots[dateString]);
//       setShowTimeModal(true);
//     } else {
//       // Open modal for new time selection
//       setSelectedDateForTime(clickedDate);
//       setShowTimeModal(true);
//       setTimeSlots([]);
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
//     const dateString = clickedDate.toISOString().split('T')[0];
//     return selectedDates.includes(dateString);
//   };

//   const isPastDate = (day) => {
//     if (!day) return false;
//     const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return clickedDate < today;
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

//   const addTimeSlot = () => {
//     setTimeSlots(prev => [...prev, { startTime: '', endTime: '' }]);
//   };

//   const roundToNearest15Minutes = (timeString) => {
//     if (!timeString) return '';
//     const [hours, minutes] = timeString.split(':').map(Number);
//     const totalMinutes = hours * 60 + minutes;
//     const roundedMinutes = Math.round(totalMinutes / 15) * 15;
//     const roundedHours = Math.floor(roundedMinutes / 60);
//     const remainingMinutes = roundedMinutes % 60;
//     return `${roundedHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
//   };

//   const calculateDuration = (startTime, endTime) => {
//     if (!startTime || !endTime) return 0;
//     const [startHours, startMinutes] = startTime.split(':').map(Number);
//     const [endHours, endMinutes] = endTime.split(':').map(Number);
//     const startTotalMinutes = startHours * 60 + startMinutes;
//     const endTotalMinutes = endHours * 60 + endMinutes;
//     return (endTotalMinutes - startTotalMinutes) / 60; // Duration in hours
//   };

//   const getMaxDailyHours = () => {
//     return (userOwnershipPercentage / 100) * 24; // Max hours based on ownership percentage
//   };

//   const getTotalSelectedHours = () => {
//     return timeSlots.reduce((total, slot) => {
//       return total + calculateDuration(slot.startTime, slot.endTime);
//     }, 0);
//   };

//   const updateTimeSlot = (index, field, value) => {
//     const roundedValue = roundToNearest15Minutes(value);
//     setTimeSlots(prev => prev.map((slot, i) => 
//       i === index ? { ...slot, [field]: roundedValue } : slot
//     ));
//   };

//   const removeTimeSlot = (index) => {
//     setTimeSlots(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleConfirmTimeSlots = () => {
//     if (timeSlots.length === 0) {
//       alert('Vui lòng thêm ít nhất một khung giờ');
//       return;
//     }

//     // Validate each time slot
//     for (let i = 0; i < timeSlots.length; i++) {
//       const slot = timeSlots[i];
//       if (!slot.startTime || !slot.endTime) {
//         alert(`Vui lòng điền đầy đủ thời gian cho khung giờ ${i + 1}`);
//         return;
//       }

//       const duration = calculateDuration(slot.startTime, slot.endTime);
//       if (duration < 1) {
//         alert(`Khung giờ ${i + 1} phải có thời lượng tối thiểu 1 giờ`);
//         return;
//       }

//       if (duration > getMaxDailyHours()) {
//         alert(`Khung giờ ${i + 1} vượt quá thời lượng tối đa ${getMaxDailyHours()} giờ (${userOwnershipPercentage}% sở hữu)`);
//         return;
//       }
//     }

//     // Check total hours
//     const totalHours = getTotalSelectedHours();
//     if (totalHours > getMaxDailyHours()) {
//       alert(`Tổng thời gian đăng ký (${totalHours.toFixed(2)}h) vượt quá giới hạn ${getMaxDailyHours()}h (${userOwnershipPercentage}% sở hữu)`);
//       return;
//     }

//     const dateString = selectedDateForTime.toISOString().split('T')[0];
    
//     // Store registered time slots
//     setRegisteredTimeSlots(prev => ({
//       ...prev,
//       [dateString]: [...timeSlots]
//     }));
    
//     // Add to selected dates if not already there
//     setSelectedDates(prev => {
//       if (!prev.includes(dateString)) {
//         return [...prev, dateString];
//       }
//       return prev;
//     });
    
//     // Show success alert
//     alert(`Đăng ký thành công cho ngày ${selectedDateForTime.toLocaleDateString('vi-VN')}!\nĐã đăng ký ${timeSlots.length} khung giờ với tổng thời gian ${totalHours.toFixed(2)} giờ.`);
    
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   const handleCancelTimeSlots = () => {
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   const handleCancelRegistration = () => {
//     const dateString = selectedDateForTime.toISOString().split('T')[0];
    
//     // Remove from registered time slots
//     setRegisteredTimeSlots(prev => {
//       const newSlots = { ...prev };
//       delete newSlots[dateString];
//       return newSlots;
//     });
    
//     // Remove from selected dates
//     setSelectedDates(prev => prev.filter(date => date !== dateString));
    
//     // Show confirmation
//     alert(`Đã hủy đăng ký cho ngày ${selectedDateForTime.toLocaleDateString('vi-VN')}`);
    
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pt-24 pb-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-indigo-900 mb-4">
//               Đăng Ký Lịch Sử Dụng Xe Đồng Sở Hữu
//             </h1>
//         </div>

//         {/* Two Separate Forms Layout */}
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
//           {/* Left Form - Vehicle Selection (1/3) */}
//           <div className="bg-white rounded-xl shadow-lg p-8 xl:col-span-1">
//             <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Thông tin đăng ký</h2>
            
//             {/* Vehicle Selection */}
//             <div className="mb-8">
//               <select
//                 name="vehicleId"
//                 value={formData.vehicleId}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-6 py-4 text-lg border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//               >
//                 <option value="">-- Chọn xe --</option>
//                 {availableVehicles.map(vehicle => (
//                   <option key={vehicle.id} value={vehicle.id}>
//                     {vehicle.name} - {vehicle.licensePlate} ({vehicle.status})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Right Form - Calendar (2/3) */}
//           <div className="bg-white rounded-xl shadow-lg p-8 xl:col-span-2">
//             <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Chọn ngày sử dụng</h2>
            
//             {/* Calendar Navigation */}
//             <div className="flex items-center justify-between mb-6">
//               <button
//                 type="button"
//                 onClick={goToPreviousMonth}
//                 className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                 title="Tháng trước"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>

//               <div className="text-center">
//                 <h3 className="text-2xl font-bold text-indigo-900">
//                   {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
//                 </h3>
//                 <button
//                   type="button"
//                   onClick={goToToday}
//                   className="text-base text-indigo-600 hover:text-indigo-800 font-medium"
//                 >
//                   Hôm nay
//                 </button>
//               </div>

//               <button
//                 type="button"
//                 onClick={goToNextMonth}
//                 className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                 title="Tháng sau"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>

//             {/* Calendar Grid */}
//             <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
//               {/* Day Headers */}
//               <div className="grid grid-cols-7 gap-2 mb-4">
//                 {dayNames.map((day) => (
//                   <div
//                     key={day}
//                     className="p-3 text-center text-base font-semibold text-gray-500 uppercase tracking-wider"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>

//               {/* Calendar Days */}
//               <div className="grid grid-cols-7 gap-2">
//                 {getDaysInMonth(currentDate).map((day, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() => handleDateClick(day)}
//                     disabled={isPastDate(day)}
//                     className={`relative p-4 min-h-[60px] border-2 border-gray-100 transition-all duration-200 ${
//                       day
//                         ? isPastDate(day)
//                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           : 'hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer'
//                         : 'bg-gray-50'
//                     } ${
//                       isToday(day)
//                         ? 'bg-green-100 border-green-300 text-green-900 font-bold'
//                         : ''
//                     } ${
//                       isSelected(day)
//                         ? 'bg-green-200 border-green-400 text-green-900 font-semibold'
//                         : ''
//                     }`}
//                   >
//                     {day && (
//                       <span className="text-base">
//                         {day}
//                       </span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Time Selection Modal */}
//         {showTimeModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-2xl font-bold text-indigo-900">
//                   {registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] 
//                     ? `Khung giờ đã đăng ký - ${selectedDateForTime?.toLocaleDateString('vi-VN')}`
//                     : `Chọn khung giờ cho ngày ${selectedDateForTime?.toLocaleDateString('vi-VN')}`
//                   }
//                 </h3>
//                 <button
//                   onClick={handleCancelTimeSlots}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {timeSlots.map((slot, index) => {
//                   const duration = calculateDuration(slot.startTime, slot.endTime);
//                   const isValidDuration = duration >= 1 && duration <= getMaxDailyHours();
//                   const isViewingMode = registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]];
                  
//                   return (
//                     <div key={index} className={`flex items-center space-x-4 p-4 border rounded-lg ${
//                       isValidDuration ? 'border-gray-200' : 'border-red-300 bg-red-50'
//                     } ${isViewingMode ? 'bg-green-50 border-green-200' : ''}`}>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Giờ bắt đầu
//                         </label>
//                         <input
//                           type="time"
//                           value={slot.startTime}
//                           onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
//                           disabled={isViewingMode}
//                           className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none ${
//                             isViewingMode ? 'bg-gray-100 cursor-not-allowed' : ''
//                           }`}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Giờ kết thúc
//                         </label>
//                         <input
//                           type="time"
//                           value={slot.endTime}
//                           onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
//                           disabled={isViewingMode}
//                           className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none ${
//                             isViewingMode ? 'bg-gray-100 cursor-not-allowed' : ''
//                           }`}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Thời lượng
//                         </label>
//                         <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
//                           isViewingMode 
//                             ? 'text-green-600 bg-green-100' 
//                             : isValidDuration 
//                               ? 'text-green-600 bg-green-100' 
//                               : 'text-red-600 bg-red-100'
//                         }`}>
//                           {duration > 0 ? `${duration.toFixed(2)}h` : 'Chưa chọn'}
//                         </div>
//                       </div>
//                       {!isViewingMode && (
//                         <button
//                           onClick={() => removeTimeSlot(index)}
//                           className="text-red-500 hover:text-red-700 p-2"
//                           title="Xóa khung giờ"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       )}
//                     </div>
//                   );
//                 })}

//                 {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                   <button
//                     onClick={addTimeSlot}
//                     className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
//                   >
//                     + Thêm khung giờ
//                   </button>
//                 )}
//               </div>

//               <div className="flex justify-between items-center mt-8">
//                 <div className="text-sm text-gray-600">
//                   <p>Tổng thời gian: <span className="font-semibold text-indigo-600">{getTotalSelectedHours().toFixed(2)}h</span></p>
//                   {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                     <p>Giới hạn: <span className="font-semibold text-gray-700">{getMaxDailyHours()}h</span></p>
//                   )}
//                 </div>
//                 <div className="flex space-x-4">
//                   <button
//                     onClick={registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] 
//                       ? handleCancelRegistration 
//                       : handleCancelTimeSlots}
//                     className={`px-6 py-3 rounded-lg transition-colors ${
//                       registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]]
//                         ? 'bg-red-600 text-white hover:bg-red-700'
//                         : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     {registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] ? 'Hủy đăng ký' : 'Hủy'}
//                   </button>
//                   {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                     <button
//                       onClick={handleConfirmTimeSlots}
//                       disabled={getTotalSelectedHours() === 0 || getTotalSelectedHours() > getMaxDailyHours()}
//                       className={`px-6 py-3 rounded-lg transition-colors ${
//                         getTotalSelectedHours() === 0 || getTotalSelectedHours() > getMaxDailyHours()
//                           ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
//                           : 'bg-indigo-600 text-white hover:bg-indigo-700'
//                       }`}
//                     >
//                       Đăng ký
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//         </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RegistercarPage;
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

//   // const [isSubmitting, setIsSubmitting] = useState(false);
//   // const [selectedTemplate, setSelectedTemplate] = useState('');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDates, setSelectedDates] = useState([]);
//   const [showTimeModal, setShowTimeModal] = useState(false);
//   const [selectedDateForTime, setSelectedDateForTime] = useState(null);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [userOwnershipPercentage] = useState(25); // Example: 25% ownership = 6 hours max per day
//   const [registeredTimeSlots, setRegisteredTimeSlots] = useState({}); // Store registered time slots by date

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
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }
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

//     if (clickedDate < today) return;

//     const dateString = clickedDate.toISOString().split('T')[0];
    
//     // Check if date is already registered
//     if (registeredTimeSlots[dateString]) {
//       // Show existing registered time slots
//       setSelectedDateForTime(clickedDate);
//       setTimeSlots(registeredTimeSlots[dateString]);
//       setShowTimeModal(true);
//     } else {
//       // Open modal for new time selection
//       setSelectedDateForTime(clickedDate);
//       setShowTimeModal(true);
//       setTimeSlots([]);
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
//     const dateString = clickedDate.toISOString().split('T')[0];
//     return selectedDates.includes(dateString);
//   };

//   const isPastDate = (day) => {
//     if (!day) return false;
//     const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return clickedDate < today;
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

//   const addTimeSlot = () => {
//     setTimeSlots(prev => [...prev, { startTime: '', endTime: '' }]);
//   };

//   const roundToNearest15Minutes = (timeString) => {
//     if (!timeString) return '';
//     const [hours, minutes] = timeString.split(':').map(Number);
//     const totalMinutes = hours * 60 + minutes;
//     const roundedMinutes = Math.round(totalMinutes / 15) * 15;
//     const roundedHours = Math.floor(roundedMinutes / 60);
//     const remainingMinutes = roundedMinutes % 60;
//     return `${roundedHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
//   };

//   const calculateDuration = (startTime, endTime) => {
//     if (!startTime || !endTime) return 0;
//     const [startHours, startMinutes] = startTime.split(':').map(Number);
//     const [endHours, endMinutes] = endTime.split(':').map(Number);
//     const startTotalMinutes = startHours * 60 + startMinutes;
//     const endTotalMinutes = endHours * 60 + endMinutes;
//     return (endTotalMinutes - startTotalMinutes) / 60; // Duration in hours
//   };

//   const getMaxDailyHours = () => {
//     return (userOwnershipPercentage / 100) * 24; // Max hours based on ownership percentage
//   };

//   const getTotalSelectedHours = () => {
//     return timeSlots.reduce((total, slot) => {
//       return total + calculateDuration(slot.startTime, slot.endTime);
//     }, 0);
//   };

//   const updateTimeSlot = (index, field, value) => {
//     const roundedValue = roundToNearest15Minutes(value);
//     setTimeSlots(prev => prev.map((slot, i) => 
//       i === index ? { ...slot, [field]: roundedValue } : slot
//     ));
//   };

//   const removeTimeSlot = (index) => {
//     setTimeSlots(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleConfirmTimeSlots = () => {
//     if (timeSlots.length === 0) {
//       alert('Vui lòng thêm ít nhất một khung giờ');
//       return;
//     }

//     // Validate each time slot
//     for (let i = 0; i < timeSlots.length; i++) {
//       const slot = timeSlots[i];
//       if (!slot.startTime || !slot.endTime) {
//         alert(`Vui lòng điền đầy đủ thời gian cho khung giờ ${i + 1}`);
//         return;
//       }

//       const duration = calculateDuration(slot.startTime, slot.endTime);
//       if (duration < 1) {
//         alert(`Khung giờ ${i + 1} phải có thời lượng tối thiểu 1 giờ`);
//         return;
//       }

//       if (duration > getMaxDailyHours()) {
//         alert(`Khung giờ ${i + 1} vượt quá thời lượng tối đa ${getMaxDailyHours()} giờ (${userOwnershipPercentage}% sở hữu)`);
//         return;
//       }
//     }

//     // Check total hours
//     const totalHours = getTotalSelectedHours();
//     if (totalHours > getMaxDailyHours()) {
//       alert(`Tổng thời gian đăng ký (${totalHours.toFixed(2)}h) vượt quá giới hạn ${getMaxDailyHours()}h (${userOwnershipPercentage}% sở hữu)`);
//       return;
//     }

//     const dateString = selectedDateForTime.toISOString().split('T')[0];
    
//     // Store registered time slots
//     setRegisteredTimeSlots(prev => ({
//       ...prev,
//       [dateString]: [...timeSlots]
//     }));
    
//     // Add to selected dates if not already there
//     setSelectedDates(prev => {
//       if (!prev.includes(dateString)) {
//         return [...prev, dateString];
//       }
//       return prev;
//     });
    
//     // Show success alert
//     alert(`Đăng ký thành công cho ngày ${selectedDateForTime.toLocaleDateString('vi-VN')}!\nĐã đăng ký ${timeSlots.length} khung giờ với tổng thời gian ${totalHours.toFixed(2)} giờ.`);
    
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   const handleCancelTimeSlots = () => {
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   const handleCancelRegistration = () => {
//     const dateString = selectedDateForTime.toISOString().split('T')[0];
    
//     // Remove from registered time slots
//     setRegisteredTimeSlots(prev => {
//       const newSlots = { ...prev };
//       delete newSlots[dateString];
//       return newSlots;
//     });
    
//     // Remove from selected dates
//     setSelectedDates(prev => prev.filter(date => date !== dateString));
    
//     // Show confirmation
//     alert(`Đã hủy đăng ký cho ngày ${selectedDateForTime.toLocaleDateString('vi-VN')}`);
    
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pt-24 pb-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-indigo-900 mb-4">
//               Đăng Ký Lịch Sử Dụng Xe Đồng Sở Hữu
//             </h1>
//         </div>

//         {/* Two Separate Forms Layout */}
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
//           {/* Left Form - Vehicle Selection (1/3) */}
//           <div className="bg-white rounded-xl shadow-lg p-8 xl:col-span-1">
//             <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Thông tin đăng ký</h2>
            
//             {/* Vehicle Selection */}
//             <div className="mb-8">
//               <select
//                 name="vehicleId"
//                 value={formData.vehicleId}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-6 py-4 text-lg border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//               >
//                 <option value="">-- Chọn xe --</option>
//                 {availableVehicles.map(vehicle => (
//                   <option key={vehicle.id} value={vehicle.id}>
//                     {vehicle.name} - {vehicle.licensePlate} ({vehicle.status})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Right Form - Calendar (2/3) */}
//           <div className="bg-white rounded-xl shadow-lg p-8 xl:col-span-2">
//             <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Chọn ngày sử dụng</h2>
            
//             {/* Calendar Navigation */}
//             <div className="flex items-center justify-between mb-6">
//               <button
//                 type="button"
//                 onClick={goToPreviousMonth}
//                 className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                 title="Tháng trước"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>

//               <div className="text-center">
//                 <h3 className="text-2xl font-bold text-indigo-900">
//                   {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
//                 </h3>
//                 <button
//                   type="button"
//                   onClick={goToToday}
//                   className="text-base text-indigo-600 hover:text-indigo-800 font-medium"
//                 >
//                   Hôm nay
//                 </button>
//               </div>

//               <button
//                 type="button"
//                 onClick={goToNextMonth}
//                 className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                 title="Tháng sau"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>

//             {/* Calendar Grid */}
//             <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
//               {/* Day Headers */}
//               <div className="grid grid-cols-7 gap-2 mb-4">
//                 {dayNames.map((day) => (
//                   <div
//                     key={day}
//                     className="p-3 text-center text-base font-semibold text-gray-500 uppercase tracking-wider"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>

//               {/* Calendar Days */}
//               <div className="grid grid-cols-7 gap-2">
//                 {getDaysInMonth(currentDate).map((day, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() => handleDateClick(day)}
//                     disabled={isPastDate(day)}
//                     className={`relative p-4 min-h-[60px] border-2 border-gray-100 transition-all duration-200 ${
//                       day
//                         ? isPastDate(day)
//                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           : 'hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer'
//                         : 'bg-gray-50'
//                     } ${
//                       isToday(day)
//                         ? 'bg-green-100 border-green-300 text-green-900 font-bold'
//                         : ''
//                     } ${
//                       isSelected(day)
//                         ? 'bg-green-200 border-green-400 text-green-900 font-semibold'
//                         : ''
//                     }`}
//                   >
//                     {day && (
//                       <span className="text-base">
//                         {day}
//                       </span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Time Selection Modal */}
//         {showTimeModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-2xl font-bold text-indigo-900">
//                   {registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] 
//                     ? `Khung giờ đã đăng ký - ${selectedDateForTime?.toLocaleDateString('vi-VN')}`
//                     : `Chọn khung giờ cho ngày ${selectedDateForTime?.toLocaleDateString('vi-VN')}`
//                   }
//                 </h3>
//                 <button
//                   onClick={handleCancelTimeSlots}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {timeSlots.map((slot, index) => {
//                   const duration = calculateDuration(slot.startTime, slot.endTime);
//                   const isValidDuration = duration >= 1 && duration <= getMaxDailyHours();
//                   const isViewingMode = registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]];
                  
//                   return (
//                     <div key={index} className={`flex items-center space-x-4 p-4 border rounded-lg ${
//                       isValidDuration ? 'border-gray-200' : 'border-red-300 bg-red-50'
//                     } ${isViewingMode ? 'bg-green-50 border-green-200' : ''}`}>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Giờ bắt đầu
//                         </label>
//                         <input
//                           type="time"
//                           value={slot.startTime}
//                           onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
//                           disabled={isViewingMode}
//                           className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none ${
//                             isViewingMode ? 'bg-gray-100 cursor-not-allowed' : ''
//                           }`}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Giờ kết thúc
//                         </label>
//                         <input
//                           type="time"
//                           value={slot.endTime}
//                           onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
//                           disabled={isViewingMode}
//                           className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none ${
//                             isViewingMode ? 'bg-gray-100 cursor-not-allowed' : ''
//                           }`}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Thời lượng
//                         </label>
//                         <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
//                           isViewingMode 
//                             ? 'text-green-600 bg-green-100' 
//                             : isValidDuration 
//                               ? 'text-green-600 bg-green-100' 
//                               : 'text-red-600 bg-red-100'
//                         }`}>
//                           {duration > 0 ? `${duration.toFixed(2)}h` : 'Chưa chọn'}
//                         </div>
//                       </div>
//                       {!isViewingMode && (
//                         <button
//                           onClick={() => removeTimeSlot(index)}
//                           className="text-red-500 hover:text-red-700 p-2"
//                           title="Xóa khung giờ"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       )}
//                     </div>
//                   );
//                 })}

//                 {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                   <button
//                     onClick={addTimeSlot}
//                     className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
//                   >
//                     + Thêm khung giờ
//                   </button>
//                 )}
//               </div>

//               <div className="flex justify-between items-center mt-8">
//                 <div className="text-sm text-gray-600">
//                   <p>Tổng thời gian: <span className="font-semibold text-indigo-600">{getTotalSelectedHours().toFixed(2)}h</span></p>
//                   {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                     <p>Giới hạn: <span className="font-semibold text-gray-700">{getMaxDailyHours()}h</span></p>
//                   )}
//                 </div>
//                 <div className="flex space-x-4">
//                   <button
//                     onClick={registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] 
//                       ? handleCancelRegistration 
//                       : handleCancelTimeSlots}
//                     className={`px-6 py-3 rounded-lg transition-colors ${
//                       registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]]
//                         ? 'bg-red-600 text-white hover:bg-red-700'
//                         : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     {registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] ? 'Hủy đăng ký' : 'Hủy'}
//                   </button>
//                   {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                     <button
//                       onClick={handleConfirmTimeSlots}
//                       disabled={getTotalSelectedHours() === 0 || getTotalSelectedHours() > getMaxDailyHours()}
//                       className={`px-6 py-3 rounded-lg transition-colors ${
//                         getTotalSelectedHours() === 0 || getTotalSelectedHours() > getMaxDailyHours()
//                           ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
//                           : 'bg-indigo-600 text-white hover:bg-indigo-700'
//                       }`}
//                     >
//                       Đăng ký
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//         </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RegistercarPage;
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

//   // const [isSubmitting, setIsSubmitting] = useState(false);
//   // const [selectedTemplate, setSelectedTemplate] = useState('');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDates, setSelectedDates] = useState([]);
//   const [showTimeModal, setShowTimeModal] = useState(false);
//   const [selectedDateForTime, setSelectedDateForTime] = useState(null);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [userOwnershipPercentage] = useState(25); // Example: 25% ownership = 6 hours max per day
//   const [registeredTimeSlots, setRegisteredTimeSlots] = useState({}); // Store registered time slots by date

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
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }
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

//     if (clickedDate < today) return;

//     const dateString = clickedDate.toISOString().split('T')[0];
    
//     // Check if date is already registered
//     if (registeredTimeSlots[dateString]) {
//       // Show existing registered time slots
//       setSelectedDateForTime(clickedDate);
//       setTimeSlots(registeredTimeSlots[dateString]);
//       setShowTimeModal(true);
//     } else {
//       // Open modal for new time selection
//       setSelectedDateForTime(clickedDate);
//       setShowTimeModal(true);
//       setTimeSlots([]);
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
//     const dateString = clickedDate.toISOString().split('T')[0];
//     return selectedDates.includes(dateString);
//   };

//   const isPastDate = (day) => {
//     if (!day) return false;
//     const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return clickedDate < today;
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

//   const addTimeSlot = () => {
//     setTimeSlots(prev => [...prev, { startTime: '', endTime: '' }]);
//   };

//   const roundToNearest15Minutes = (timeString) => {
//     if (!timeString) return '';
//     const [hours, minutes] = timeString.split(':').map(Number);
//     const totalMinutes = hours * 60 + minutes;
//     const roundedMinutes = Math.round(totalMinutes / 15) * 15;
//     const roundedHours = Math.floor(roundedMinutes / 60);
//     const remainingMinutes = roundedMinutes % 60;
//     return `${roundedHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
//   };

//   const calculateDuration = (startTime, endTime) => {
//     if (!startTime || !endTime) return 0;
//     const [startHours, startMinutes] = startTime.split(':').map(Number);
//     const [endHours, endMinutes] = endTime.split(':').map(Number);
//     const startTotalMinutes = startHours * 60 + startMinutes;
//     const endTotalMinutes = endHours * 60 + endMinutes;
//     return (endTotalMinutes - startTotalMinutes) / 60; // Duration in hours
//   };

//   const getMaxDailyHours = () => {
//     return (userOwnershipPercentage / 100) * 24; // Max hours based on ownership percentage
//   };

//   const getTotalSelectedHours = () => {
//     return timeSlots.reduce((total, slot) => {
//       return total + calculateDuration(slot.startTime, slot.endTime);
//     }, 0);
//   };

//   const updateTimeSlot = (index, field, value) => {
//     const roundedValue = roundToNearest15Minutes(value);
//     setTimeSlots(prev => prev.map((slot, i) => 
//       i === index ? { ...slot, [field]: roundedValue } : slot
//     ));
//   };

//   const removeTimeSlot = (index) => {
//     setTimeSlots(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleConfirmTimeSlots = () => {
//     if (timeSlots.length === 0) {
//       alert('Vui lòng thêm ít nhất một khung giờ');
//       return;
//     }

//     // Validate each time slot
//     for (let i = 0; i < timeSlots.length; i++) {
//       const slot = timeSlots[i];
//       if (!slot.startTime || !slot.endTime) {
//         alert(`Vui lòng điền đầy đủ thời gian cho khung giờ ${i + 1}`);
//         return;
//       }

//       const duration = calculateDuration(slot.startTime, slot.endTime);
//       if (duration < 1) {
//         alert(`Khung giờ ${i + 1} phải có thời lượng tối thiểu 1 giờ`);
//         return;
//       }

//       if (duration > getMaxDailyHours()) {
//         alert(`Khung giờ ${i + 1} vượt quá thời lượng tối đa ${getMaxDailyHours()} giờ (${userOwnershipPercentage}% sở hữu)`);
//         return;
//       }
//     }

//     // Check total hours
//     const totalHours = getTotalSelectedHours();
//     if (totalHours > getMaxDailyHours()) {
//       alert(`Tổng thời gian đăng ký (${totalHours.toFixed(2)}h) vượt quá giới hạn ${getMaxDailyHours()}h (${userOwnershipPercentage}% sở hữu)`);
//       return;
//     }

//     const dateString = selectedDateForTime.toISOString().split('T')[0];
    
//     // Store registered time slots
//     setRegisteredTimeSlots(prev => ({
//       ...prev,
//       [dateString]: [...timeSlots]
//     }));
    
//     // Add to selected dates if not already there
//     setSelectedDates(prev => {
//       if (!prev.includes(dateString)) {
//         return [...prev, dateString];
//       }
//       return prev;
//     });
    
//     // Show success alert
//     alert(`Đăng ký thành công cho ngày ${selectedDateForTime.toLocaleDateString('vi-VN')}!\nĐã đăng ký ${timeSlots.length} khung giờ với tổng thời gian ${totalHours.toFixed(2)} giờ.`);
    
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   const handleCancelTimeSlots = () => {
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   const handleCancelRegistration = () => {
//     const dateString = selectedDateForTime.toISOString().split('T')[0];
    
//     // Remove from registered time slots
//     setRegisteredTimeSlots(prev => {
//       const newSlots = { ...prev };
//       delete newSlots[dateString];
//       return newSlots;
//     });
    
//     // Remove from selected dates
//     setSelectedDates(prev => prev.filter(date => date !== dateString));
    
//     // Show confirmation
//     alert(`Đã hủy đăng ký cho ngày ${selectedDateForTime.toLocaleDateString('vi-VN')}`);
    
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pt-24 pb-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-indigo-900 mb-4">
//               Đăng Ký Lịch Sử Dụng Xe Đồng Sở Hữu
//             </h1>
//         </div>

//         {/* Two Separate Forms Layout */}
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
//           {/* Left Form - Vehicle Selection (1/3) */}
//           <div className="bg-white rounded-xl shadow-lg p-8 xl:col-span-1">
//             <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Thông tin đăng ký</h2>
            
//             {/* Vehicle Selection */}
//             <div className="mb-8">
//               <select
//                 name="vehicleId"
//                 value={formData.vehicleId}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-6 py-4 text-lg border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//               >
//                 <option value="">-- Chọn xe --</option>
//                 {availableVehicles.map(vehicle => (
//                   <option key={vehicle.id} value={vehicle.id}>
//                     {vehicle.name} - {vehicle.licensePlate} ({vehicle.status})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Right Form - Calendar (2/3) */}
//           <div className="bg-white rounded-xl shadow-lg p-8 xl:col-span-2">
//             <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Chọn ngày sử dụng</h2>
            
//             {/* Calendar Navigation */}
//             <div className="flex items-center justify-between mb-6">
//               <button
//                 type="button"
//                 onClick={goToPreviousMonth}
//                 className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                 title="Tháng trước"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>

//               <div className="text-center">
//                 <h3 className="text-2xl font-bold text-indigo-900">
//                   {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
//                 </h3>
//                 <button
//                   type="button"
//                   onClick={goToToday}
//                   className="text-base text-indigo-600 hover:text-indigo-800 font-medium"
//                 >
//                   Hôm nay
//                 </button>
//               </div>

//               <button
//                 type="button"
//                 onClick={goToNextMonth}
//                 className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                 title="Tháng sau"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>

//             {/* Calendar Grid */}
//             <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
//               {/* Day Headers */}
//               <div className="grid grid-cols-7 gap-2 mb-4">
//                 {dayNames.map((day) => (
//                   <div
//                     key={day}
//                     className="p-3 text-center text-base font-semibold text-gray-500 uppercase tracking-wider"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>

//               {/* Calendar Days */}
//               <div className="grid grid-cols-7 gap-2">
//                 {getDaysInMonth(currentDate).map((day, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() => handleDateClick(day)}
//                     disabled={isPastDate(day)}
//                     className={`relative p-4 min-h-[60px] border-2 border-gray-100 transition-all duration-200 ${
//                       day
//                         ? isPastDate(day)
//                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           : 'hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer'
//                         : 'bg-gray-50'
//                     } ${
//                       isToday(day)
//                         ? 'bg-green-100 border-green-300 text-green-900 font-bold'
//                         : ''
//                     } ${
//                       isSelected(day)
//                         ? 'bg-green-200 border-green-400 text-green-900 font-semibold'
//                         : ''
//                     }`}
//                   >
//                     {day && (
//                       <span className="text-base">
//                         {day}
//                       </span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Time Selection Modal */}
//         {showTimeModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-2xl font-bold text-indigo-900">
//                   {registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] 
//                     ? `Khung giờ đã đăng ký - ${selectedDateForTime?.toLocaleDateString('vi-VN')}`
//                     : `Chọn khung giờ cho ngày ${selectedDateForTime?.toLocaleDateString('vi-VN')}`
//                   }
//                 </h3>
//                 <button
//                   onClick={handleCancelTimeSlots}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {timeSlots.map((slot, index) => {
//                   const duration = calculateDuration(slot.startTime, slot.endTime);
//                   const isValidDuration = duration >= 1 && duration <= getMaxDailyHours();
//                   const isViewingMode = registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]];
                  
//                   return (
//                     <div key={index} className={`flex items-center space-x-4 p-4 border rounded-lg ${
//                       isValidDuration ? 'border-gray-200' : 'border-red-300 bg-red-50'
//                     } ${isViewingMode ? 'bg-green-50 border-green-200' : ''}`}>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Giờ bắt đầu
//                         </label>
//                         <input
//                           type="time"
//                           value={slot.startTime}
//                           onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
//                           disabled={isViewingMode}
//                           className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none ${
//                             isViewingMode ? 'bg-gray-100 cursor-not-allowed' : ''
//                           }`}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Giờ kết thúc
//                         </label>
//                         <input
//                           type="time"
//                           value={slot.endTime}
//                           onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
//                           disabled={isViewingMode}
//                           className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none ${
//                             isViewingMode ? 'bg-gray-100 cursor-not-allowed' : ''
//                           }`}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Thời lượng
//                         </label>
//                         <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
//                           isViewingMode 
//                             ? 'text-green-600 bg-green-100' 
//                             : isValidDuration 
//                               ? 'text-green-600 bg-green-100' 
//                               : 'text-red-600 bg-red-100'
//                         }`}>
//                           {duration > 0 ? `${duration.toFixed(2)}h` : 'Chưa chọn'}
//                         </div>
//                       </div>
//                       {!isViewingMode && (
//                         <button
//                           onClick={() => removeTimeSlot(index)}
//                           className="text-red-500 hover:text-red-700 p-2"
//                           title="Xóa khung giờ"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       )}
//                     </div>
//                   );
//                 })}

//                 {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                   <button
//                     onClick={addTimeSlot}
//                     className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
//                   >
//                     + Thêm khung giờ
//                   </button>
//                 )}
//               </div>

//               <div className="flex justify-between items-center mt-8">
//                 <div className="text-sm text-gray-600">
//                   <p>Tổng thời gian: <span className="font-semibold text-indigo-600">{getTotalSelectedHours().toFixed(2)}h</span></p>
//                   {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                     <p>Giới hạn: <span className="font-semibold text-gray-700">{getMaxDailyHours()}h</span></p>
//                   )}
//                 </div>
//                 <div className="flex space-x-4">
//                   <button
//                     onClick={registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] 
//                       ? handleCancelRegistration 
//                       : handleCancelTimeSlots}
//                     className={`px-6 py-3 rounded-lg transition-colors ${
//                       registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]]
//                         ? 'bg-red-600 text-white hover:bg-red-700'
//                         : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     {registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] ? 'Hủy đăng ký' : 'Hủy'}
//                   </button>
//                   {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                     <button
//                       onClick={handleConfirmTimeSlots}
//                       disabled={getTotalSelectedHours() === 0 || getTotalSelectedHours() > getMaxDailyHours()}
//                       className={`px-6 py-3 rounded-lg transition-colors ${
//                         getTotalSelectedHours() === 0 || getTotalSelectedHours() > getMaxDailyHours()
//                           ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
//                           : 'bg-indigo-600 text-white hover:bg-indigo-700'
//                       }`}
//                     >
//                       Đăng ký
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//         </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RegistercarPage;
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

//   // const [isSubmitting, setIsSubmitting] = useState(false);
//   // const [selectedTemplate, setSelectedTemplate] = useState('');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDates, setSelectedDates] = useState([]);
//   const [showTimeModal, setShowTimeModal] = useState(false);
//   const [selectedDateForTime, setSelectedDateForTime] = useState(null);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [userOwnershipPercentage] = useState(25); // Example: 25% ownership = 6 hours max per day
//   const [registeredTimeSlots, setRegisteredTimeSlots] = useState({}); // Store registered time slots by date

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
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }
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

//     if (clickedDate < today) return;

//     const dateString = clickedDate.toISOString().split('T')[0];
    
//     // Check if date is already registered
//     if (registeredTimeSlots[dateString]) {
//       // Show existing registered time slots
//       setSelectedDateForTime(clickedDate);
//       setTimeSlots(registeredTimeSlots[dateString]);
//       setShowTimeModal(true);
//     } else {
//       // Open modal for new time selection
//       setSelectedDateForTime(clickedDate);
//       setShowTimeModal(true);
//       setTimeSlots([]);
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
//     const dateString = clickedDate.toISOString().split('T')[0];
//     return selectedDates.includes(dateString);
//   };

//   const isPastDate = (day) => {
//     if (!day) return false;
//     const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return clickedDate < today;
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

//   const addTimeSlot = () => {
//     setTimeSlots(prev => [...prev, { startTime: '', endTime: '' }]);
//   };

//   const roundToNearest15Minutes = (timeString) => {
//     if (!timeString) return '';
//     const [hours, minutes] = timeString.split(':').map(Number);
//     const totalMinutes = hours * 60 + minutes;
//     const roundedMinutes = Math.round(totalMinutes / 15) * 15;
//     const roundedHours = Math.floor(roundedMinutes / 60);
//     const remainingMinutes = roundedMinutes % 60;
//     return `${roundedHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
//   };

//   const calculateDuration = (startTime, endTime) => {
//     if (!startTime || !endTime) return 0;
//     const [startHours, startMinutes] = startTime.split(':').map(Number);
//     const [endHours, endMinutes] = endTime.split(':').map(Number);
//     const startTotalMinutes = startHours * 60 + startMinutes;
//     const endTotalMinutes = endHours * 60 + endMinutes;
//     return (endTotalMinutes - startTotalMinutes) / 60; // Duration in hours
//   };

//   const getMaxDailyHours = () => {
//     return (userOwnershipPercentage / 100) * 24; // Max hours based on ownership percentage
//   };

//   const getTotalSelectedHours = () => {
//     return timeSlots.reduce((total, slot) => {
//       return total + calculateDuration(slot.startTime, slot.endTime);
//     }, 0);
//   };

//   const updateTimeSlot = (index, field, value) => {
//     const roundedValue = roundToNearest15Minutes(value);
//     setTimeSlots(prev => prev.map((slot, i) => 
//       i === index ? { ...slot, [field]: roundedValue } : slot
//     ));
//   };

//   const removeTimeSlot = (index) => {
//     setTimeSlots(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleConfirmTimeSlots = () => {
//     if (timeSlots.length === 0) {
//       alert('Vui lòng thêm ít nhất một khung giờ');
//       return;
//     }

//     // Validate each time slot
//     for (let i = 0; i < timeSlots.length; i++) {
//       const slot = timeSlots[i];
//       if (!slot.startTime || !slot.endTime) {
//         alert(`Vui lòng điền đầy đủ thời gian cho khung giờ ${i + 1}`);
//         return;
//       }

//       const duration = calculateDuration(slot.startTime, slot.endTime);
//       if (duration < 1) {
//         alert(`Khung giờ ${i + 1} phải có thời lượng tối thiểu 1 giờ`);
//         return;
//       }

//       if (duration > getMaxDailyHours()) {
//         alert(`Khung giờ ${i + 1} vượt quá thời lượng tối đa ${getMaxDailyHours()} giờ (${userOwnershipPercentage}% sở hữu)`);
//         return;
//       }
//     }

//     // Check total hours
//     const totalHours = getTotalSelectedHours();
//     if (totalHours > getMaxDailyHours()) {
//       alert(`Tổng thời gian đăng ký (${totalHours.toFixed(2)}h) vượt quá giới hạn ${getMaxDailyHours()}h (${userOwnershipPercentage}% sở hữu)`);
//       return;
//     }

//     const dateString = selectedDateForTime.toISOString().split('T')[0];
    
//     // Store registered time slots
//     setRegisteredTimeSlots(prev => ({
//       ...prev,
//       [dateString]: [...timeSlots]
//     }));
    
//     // Add to selected dates if not already there
//     setSelectedDates(prev => {
//       if (!prev.includes(dateString)) {
//         return [...prev, dateString];
//       }
//       return prev;
//     });
    
//     // Show success alert
//     alert(`Đăng ký thành công cho ngày ${selectedDateForTime.toLocaleDateString('vi-VN')}!\nĐã đăng ký ${timeSlots.length} khung giờ với tổng thời gian ${totalHours.toFixed(2)} giờ.`);
    
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   const handleCancelTimeSlots = () => {
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   const handleCancelRegistration = () => {
//     const dateString = selectedDateForTime.toISOString().split('T')[0];
    
//     // Remove from registered time slots
//     setRegisteredTimeSlots(prev => {
//       const newSlots = { ...prev };
//       delete newSlots[dateString];
//       return newSlots;
//     });
    
//     // Remove from selected dates
//     setSelectedDates(prev => prev.filter(date => date !== dateString));
    
//     // Show confirmation
//     alert(`Đã hủy đăng ký cho ngày ${selectedDateForTime.toLocaleDateString('vi-VN')}`);
    
//     setShowTimeModal(false);
//     setSelectedDateForTime(null);
//     setTimeSlots([]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pt-24 pb-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-indigo-900 mb-4">
//               Đăng Ký Lịch Sử Dụng Xe Đồng Sở Hữu
//             </h1>
//         </div>

//         {/* Two Separate Forms Layout */}
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
//           {/* Left Form - Vehicle Selection (1/3) */}
//           <div className="bg-white rounded-xl shadow-lg p-8 xl:col-span-1">
//             <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Thông tin đăng ký</h2>
            
//             {/* Vehicle Selection */}
//             <div className="mb-8">
//               <select
//                 name="vehicleId"
//                 value={formData.vehicleId}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-6 py-4 text-lg border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//               >
//                 <option value="">-- Chọn xe --</option>
//                 {availableVehicles.map(vehicle => (
//                   <option key={vehicle.id} value={vehicle.id}>
//                     {vehicle.name} - {vehicle.licensePlate} ({vehicle.status})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Right Form - Calendar (2/3) */}
//           <div className="bg-white rounded-xl shadow-lg p-8 xl:col-span-2">
//             <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Chọn ngày sử dụng</h2>
            
//             {/* Calendar Navigation */}
//             <div className="flex items-center justify-between mb-6">
//               <button
//                 type="button"
//                 onClick={goToPreviousMonth}
//                 className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                 title="Tháng trước"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>

//               <div className="text-center">
//                 <h3 className="text-2xl font-bold text-indigo-900">
//                   {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
//                 </h3>
//                 <button
//                   type="button"
//                   onClick={goToToday}
//                   className="text-base text-indigo-600 hover:text-indigo-800 font-medium"
//                 >
//                   Hôm nay
//                 </button>
//               </div>

//               <button
//                 type="button"
//                 onClick={goToNextMonth}
//                 className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                 title="Tháng sau"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>

//             {/* Calendar Grid */}
//             <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
//               {/* Day Headers */}
//               <div className="grid grid-cols-7 gap-2 mb-4">
//                 {dayNames.map((day) => (
//                   <div
//                     key={day}
//                     className="p-3 text-center text-base font-semibold text-gray-500 uppercase tracking-wider"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>

//               {/* Calendar Days */}
//               <div className="grid grid-cols-7 gap-2">
//                 {getDaysInMonth(currentDate).map((day, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() => handleDateClick(day)}
//                     disabled={isPastDate(day)}
//                     className={`relative p-4 min-h-[60px] border-2 border-gray-100 transition-all duration-200 ${
//                       day
//                         ? isPastDate(day)
//                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           : 'hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer'
//                         : 'bg-gray-50'
//                     } ${
//                       isToday(day)
//                         ? 'bg-green-100 border-green-300 text-green-900 font-bold'
//                         : ''
//                     } ${
//                       isSelected(day)
//                         ? 'bg-green-200 border-green-400 text-green-900 font-semibold'
//                         : ''
//                     }`}
//                   >
//                     {day && (
//                       <span className="text-base">
//                         {day}
//                       </span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Time Selection Modal */}
//         {showTimeModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-2xl font-bold text-indigo-900">
//                   {registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] 
//                     ? `Khung giờ đã đăng ký - ${selectedDateForTime?.toLocaleDateString('vi-VN')}`
//                     : `Chọn khung giờ cho ngày ${selectedDateForTime?.toLocaleDateString('vi-VN')}`
//                   }
//                 </h3>
//                 <button
//                   onClick={handleCancelTimeSlots}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {timeSlots.map((slot, index) => {
//                   const duration = calculateDuration(slot.startTime, slot.endTime);
//                   const isValidDuration = duration >= 1 && duration <= getMaxDailyHours();
//                   const isViewingMode = registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]];
                  
//                   return (
//                     <div key={index} className={`flex items-center space-x-4 p-4 border rounded-lg ${
//                       isValidDuration ? 'border-gray-200' : 'border-red-300 bg-red-50'
//                     } ${isViewingMode ? 'bg-green-50 border-green-200' : ''}`}>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Giờ bắt đầu
//                         </label>
//                         <input
//                           type="time"
//                           value={slot.startTime}
//                           onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
//                           disabled={isViewingMode}
//                           className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none ${
//                             isViewingMode ? 'bg-gray-100 cursor-not-allowed' : ''
//                           }`}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Giờ kết thúc
//                         </label>
//                         <input
//                           type="time"
//                           value={slot.endTime}
//                           onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
//                           disabled={isViewingMode}
//                           className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none ${
//                             isViewingMode ? 'bg-gray-100 cursor-not-allowed' : ''
//                           }`}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Thời lượng
//                         </label>
//                         <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
//                           isViewingMode 
//                             ? 'text-green-600 bg-green-100' 
//                             : isValidDuration 
//                               ? 'text-green-600 bg-green-100' 
//                               : 'text-red-600 bg-red-100'
//                         }`}>
//                           {duration > 0 ? `${duration.toFixed(2)}h` : 'Chưa chọn'}
//                         </div>
//                       </div>
//                       {!isViewingMode && (
//                         <button
//                           onClick={() => removeTimeSlot(index)}
//                           className="text-red-500 hover:text-red-700 p-2"
//                           title="Xóa khung giờ"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       )}
//                     </div>
//                   );
//                 })}

//                 {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                   <button
//                     onClick={addTimeSlot}
//                     className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
//                   >
//                     + Thêm khung giờ
//                   </button>
//                 )}
//               </div>

//               <div className="flex justify-between items-center mt-8">
//                 <div className="text-sm text-gray-600">
//                   <p>Tổng thời gian: <span className="font-semibold text-indigo-600">{getTotalSelectedHours().toFixed(2)}h</span></p>
//                   {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                     <p>Giới hạn: <span className="font-semibold text-gray-700">{getMaxDailyHours()}h</span></p>
//                   )}
//                 </div>
//                 <div className="flex space-x-4">
//                   <button
//                     onClick={registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] 
//                       ? handleCancelRegistration 
//                       : handleCancelTimeSlots}
//                     className={`px-6 py-3 rounded-lg transition-colors ${
//                       registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]]
//                         ? 'bg-red-600 text-white hover:bg-red-700'
//                         : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     {registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] ? 'Hủy đăng ký' : 'Hủy'}
//                   </button>
//                   {!registeredTimeSlots[selectedDateForTime?.toISOString().split('T')[0]] && (
//                     <button
//                       onClick={handleConfirmTimeSlots}
//                       disabled={getTotalSelectedHours() === 0 || getTotalSelectedHours() > getMaxDailyHours()}
//                       className={`px-6 py-3 rounded-lg transition-colors ${
//                         getTotalSelectedHours() === 0 || getTotalSelectedHours() > getMaxDailyHours()
//                           ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
//                           : 'bg-indigo-600 text-white hover:bg-indigo-700'
//                       }`}
//                     >
//                       Đăng ký
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//         </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RegistercarPage;



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

//   // const [isSubmitting, setIsSubmitting] = useState(false);
//   // const [selectedTemplate, setSelectedTemplate] = useState('');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDates, setSelectedDates] = useState([]);
//   const [showTimeModal, setShowTimeModal] = useState(false);
//   const [selectedDateForTime, setSelectedDateForTime] = useState(null);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [userOwnershipPercentage] = useState(25); // Example: 25% ownership = 6 hours max per day
//   const [registeredTimeSlots, setRegisteredTimeSlots] = useState({}); // Store registered time slots by date

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

//   // const [isSubmitting, setIsSubmitting] = useState(false);
//   // const [selectedTemplate, setSelectedTemplate] = useState('');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDates, setSelectedDates] = useState([]);
//   const [showTimeModal, setShowTimeModal] = useState(false);
//   const [selectedDateForTime, setSelectedDateForTime] = useState(null);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [userOwnershipPercentage] = useState(25); // Example: 25% ownership = 6 hours max per day
//   const [registeredTimeSlots, setRegisteredTimeSlots] = useState({}); // Store registered time slots by date

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
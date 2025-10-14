import React, { useState } from 'react';
import { FaCog, FaPlus, FaSearch, FaEdit, FaCheck, FaCalendarAlt, FaWrench, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const MaintenancePage = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([
    {
      id: 1,
      vehicle: { name: 'Toyota Camry 2023', license: 'ABC-123' },
      type: 'Regular Service',
      scheduledDate: '2024-02-15',
      status: 'Scheduled',
      description: 'Oil change and general inspection'
    },
    {
      id: 2,
      vehicle: { name: 'Honda Civic 2023', license: 'XYZ-789' },
      type: 'Repair',
      scheduledDate: '2024-02-10',
      status: 'Overdue',
      description: 'Brake system repair'
    },
    {
      id: 3,
      vehicle: { name: 'Tesla Model 3 2023', license: 'DEF-456' },
      type: 'Inspection',
      scheduledDate: '2024-02-20',
      status: 'In Progress',
      description: 'Annual safety inspection'
    },
    {
      id: 4,
      vehicle: { name: 'BMW X5 2023', license: 'GHI-789' },
      type: 'Regular Service',
      scheduledDate: '2024-02-12',
      status: 'Completed',
      description: 'Engine tune-up and filter replacement'
    },
    {
      id: 5,
      vehicle: { name: 'Ford F-150 2023', license: 'JKL-012' },
      type: 'Emergency',
      scheduledDate: '2024-02-18',
      status: 'Scheduled',
      description: 'Transmission issue repair'
    },
    {
      id: 6,
      vehicle: { name: 'Audi A4 2023', license: 'MNO-345' },
      type: 'Inspection',
      scheduledDate: '2024-02-25',
      status: 'Scheduled',
      description: 'Pre-purchase inspection'
    },
    {
      id: 7,
      vehicle: { name: 'Mercedes C-Class 2023', license: 'PQR-678' },
      type: 'Repair',
      scheduledDate: '2024-02-08',
      status: 'Overdue',
      description: 'Air conditioning system repair'
    },
    {
      id: 8,
      vehicle: { name: 'Volkswagen Golf 2023', license: 'STU-901' },
      type: 'Regular Service',
      scheduledDate: '2024-02-22',
      status: 'In Progress',
      description: 'Scheduled maintenance service'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // New maintenance form state
  const [newMaintenance, setNewMaintenance] = useState({
    vehicle: '',
    type: 'Regular Service',
    scheduledDate: '',
    description: ''
  });

  // Filter maintenance records
  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = record.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.vehicle.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || record.status === statusFilter;
    const matchesType = typeFilter === 'All Types' || record.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAddMaintenance = () => {
    if (newMaintenance.vehicle && newMaintenance.scheduledDate && newMaintenance.description) {
      const record = {
        id: Math.max(...maintenanceRecords.map(r => r.id)) + 1,
        vehicle: { name: newMaintenance.vehicle, license: 'TBD' },
        type: newMaintenance.type,
        scheduledDate: newMaintenance.scheduledDate,
        status: 'Scheduled',
        description: newMaintenance.description
      };
      setMaintenanceRecords([...maintenanceRecords, record]);
      setNewMaintenance({
        vehicle: '',
        type: 'Regular Service',
        scheduledDate: '',
        description: ''
      });
      setIsModalOpen(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMaintenance({
      ...newMaintenance,
      [e.target.name]: e.target.value
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Scheduled': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Overdue': 'bg-red-100 text-red-800'
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
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          Schedule Maintenance
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search maintenance records..."
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
            <option>Scheduled</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Overdue</option>
          </select>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option>All Types</option>
            <option>Regular Service</option>
            <option>Repair</option>
            <option>Inspection</option>
            <option>Emergency</option>
          </select>
        </div>
      </div>

      {/* Maintenance List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRecords.map(record => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.vehicle.name}</div>
                        <div className="text-sm text-gray-500">License: {record.vehicle.license}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {record.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {record.scheduledDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center max-w-xs">
                    <div className="truncate" title={record.description}>
                      {record.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <FaEdit />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1">
                        <FaCheck />
                      </button>
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

      {/* Upcoming Maintenance */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Maintenance</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <FaCalendarAlt className="w-5 h-5 text-yellow-600 mr-3" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Toyota Camry - Regular Service</div>
              <div className="text-sm text-gray-500">Scheduled for Feb 15, 2024</div>
            </div>
            <span className="text-sm text-yellow-600 font-medium">2 days</span>
          </div>
          <div className="flex items-center p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
            <FaCog className="w-5 h-5 text-red-600 mr-3" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Honda Civic - Repair</div>
              <div className="text-sm text-gray-500">Overdue since Feb 10, 2024</div>
            </div>
            <span className="text-sm text-red-600 font-medium">Overdue</span>
          </div>
        </div>
      </div>

      {/* Schedule Maintenance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Schedule Maintenance</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle
                </label>
                <input
                  type="text"
                  name="vehicle"
                  value={newMaintenance.vehicle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter vehicle name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maintenance Type
                </label>
                <select
                  name="type"
                  value={newMaintenance.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Regular Service">Regular Service</option>
                  <option value="Repair">Repair</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={newMaintenance.scheduledDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newMaintenance.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter maintenance description"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleAddMaintenance}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Schedule Maintenance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;

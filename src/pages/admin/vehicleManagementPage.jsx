import React, { useState } from 'react';
import { FaCar, FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const VehicleManagementPage = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      name: 'Toyota Camry 2023',
      licensePlate: 'ABC-123',
      type: 'Sedan',
      status: 'Available',
      location: 'Downtown',
      owners: [
        { name: 'John Doe', percentage: 60 },
        { name: 'Jane Smith', percentage: 40 }
      ]
    },
    {
      id: 2,
      name: 'Honda Civic 2023',
      licensePlate: 'XYZ-789',
      type: 'Sedan',
      status: 'In Use',
      location: 'Airport',
      owners: [
        { name: 'Bob Wilson', percentage: 100 }
      ]
    },
    {
      id: 3,
      name: 'Ford F-150 2023',
      licensePlate: 'DEF-456',
      type: 'Truck',
      status: 'Maintenance',
      location: 'Garage',
      owners: [
        { name: 'Alice Johnson', percentage: 50 },
        { name: 'Charlie Brown', percentage: 30 },
        { name: 'Diana Prince', percentage: 20 }
      ]
    },
    {
      id: 4,
      name: 'BMW X5 2023',
      licensePlate: 'GHI-789',
      type: 'SUV',
      status: 'Available',
      location: 'Mall',
      owners: [
        { name: 'Eve Adams', percentage: 100 }
      ]
    },
    {
      id: 5,
      name: 'Tesla Model 3 2023',
      licensePlate: 'JKL-012',
      type: 'Electric',
      status: 'Available',
      location: 'Downtown',
      owners: [
        { name: 'Frank Miller', percentage: 70 },
        { name: 'Grace Lee', percentage: 30 }
      ]
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    licensePlate: '',
    type: 'Sedan',
    location: '',
    owners: [{ name: '', percentage: 100 }]
  });

  // Pagination calculations
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAddVehicle = () => {
    const totalPercentage = newVehicle.owners.reduce((sum, owner) => sum + (owner.percentage || 0), 0);
    if (totalPercentage !== 100) {
      alert('Tổng phần trăm sở hữu phải bằng 100%');
      return;
    }

    if (newVehicle.name && newVehicle.licensePlate && newVehicle.location) {
      const vehicle = {
        id: Math.max(...vehicles.map(v => v.id)) + 1,
        ...newVehicle,
        status: 'Available'
      };
      setVehicles([...vehicles, vehicle]);
      setNewVehicle({
        name: '',
        licensePlate: '',
        type: 'Sedan',
        location: '',
        owners: [{ name: '', percentage: 100 }]
      });
      setIsAddModalOpen(false);
    }
  };

  const handleInputChange = (e) => {
    setNewVehicle({
      ...newVehicle,
      [e.target.name]: e.target.value
    });
  };

  const handleOwnerChange = (index, field, value) => {
    const newOwners = [...newVehicle.owners];
    newOwners[index][field] = field === 'percentage' ? parseInt(value) || 0 : value;
    setNewVehicle({
      ...newVehicle,
      owners: newOwners
    });
  };

  const addOwner = () => {
    setNewVehicle({
      ...newVehicle,
      owners: [...newVehicle.owners, { name: '', percentage: 0 }]
    });
  };

  const removeOwner = (index) => {
    if (newVehicle.owners.length > 1) {
      const newOwners = newVehicle.owners.filter((_, i) => i !== index);
      setNewVehicle({
        ...newVehicle,
        owners: newOwners
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Available': 'bg-green-100 text-green-800',
      'In Use': 'bg-yellow-100 text-yellow-800',
      'Maintenance': 'bg-red-100 text-red-800'
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
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Vehicle
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
                placeholder="Search by license plate or vehicle name..."
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
            <option>Available</option>
            <option>In Use</option>
            <option>Maintenance</option>
          </select>
        </div>
      </div>

      {/* Vehicle List */}
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
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentVehicles.map(vehicle => (
                <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaCar className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                        <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                        <div className="text-sm text-gray-500">License: {vehicle.licensePlate}</div>
                    </div>
                  </div>
                </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {vehicle.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(vehicle.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {vehicle.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setIsDetailModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900 p-1">
                    <FaEdit />
                  </button>
                      <button className="text-red-600 hover:text-red-900 p-1">
                    <FaTrash />
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

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Vehicle</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newVehicle.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter vehicle name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Plate
                  </label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={newVehicle.licensePlate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter license plate"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    name="type"
                    value={newVehicle.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                    <option value="Electric">Electric</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={newVehicle.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ownership Details
                </label>
                <div className="space-y-3">
                  {newVehicle.owners.map((owner, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={owner.name}
                          onChange={(e) => handleOwnerChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Owner name"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          value={owner.percentage}
                          onChange={(e) => handleOwnerChange(index, 'percentage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="%"
                          min="0"
                          max="100"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOwner(index)}
                        disabled={newVehicle.owners.length === 1}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOwner}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <FaPlus className="w-3 h-3 mr-1" />
                    Add Owner
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Total: {newVehicle.owners.reduce((sum, owner) => sum + (owner.percentage || 0), 0)}%
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleAddVehicle}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Details Modal */}
      {isDetailModalOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Vehicle Details</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
                  <div className="flex items-center">
                    <FaCar className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                  <div className="text-lg font-medium text-gray-900">{selectedVehicle.name}</div>
                  <div className="text-sm text-gray-500">License: {selectedVehicle.licensePlate}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <div className="text-gray-900">{selectedVehicle.type}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <div className="mt-1">{getStatusBadge(selectedVehicle.status)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <div className="text-gray-900">{selectedVehicle.location}</div>
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-700 text-sm">Ownership:</span>
                <div className="mt-2 space-y-2">
                  {selectedVehicle.owners.map((owner, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-900">{owner.name}</span>
                      <span className="text-sm font-medium text-blue-600">{owner.percentage}%</span>
                    </div>
                  ))}
                </div>
                    </div>
                  </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
                  </button>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagementPage;

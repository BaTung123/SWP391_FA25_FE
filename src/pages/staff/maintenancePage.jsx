import React from 'react';
import { FaCog, FaPlus, FaSearch, FaEdit, FaCheck, FaCalendarAlt, FaWrench } from 'react-icons/fa';

const MaintenancePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Scheduled</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Overdue</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaWrench className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Toyota Camry 2023</div>
                      <div className="text-sm text-gray-500">License: ABC-123</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Regular Service</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-02-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Scheduled
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Mike Johnson</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <FaEdit />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <FaCheck />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaWrench className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Honda Civic 2023</div>
                      <div className="text-sm text-gray-500">License: XYZ-789</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Repair</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-02-10</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Overdue
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sarah Davis</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <FaEdit />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <FaCheck />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaWrench className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Tesla Model 3 2023</div>
                      <div className="text-sm text-gray-500">License: DEF-456</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Inspection</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-02-20</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tom Wilson</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <FaEdit />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <FaCheck />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
    </div>
  );
};

export default MaintenancePage;

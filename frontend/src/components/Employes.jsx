import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { BASE_URL_API } from '../../global';

const BASE_URL = BASE_URL_API;
const EmployeeList = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [limit] = useState(5); 

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/me`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },  
        });
        setAdmin(response.data);
      } catch (error) {
        console.error('Error fetching admin:', error);
      }
    };
    fetchAdmin();
  }, []);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/employee`, {
          params: {
            search: searchQuery,
            page: currentPage,
            limit: limit,
          },
          headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        });
        setEmployees(response.data.employees);
        setTotalEmployees(response.data.total);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, [searchQuery, currentPage, limit]); 
  const handleEdit = (employee) => {
    navigate(`/updateemployee/${employee._id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/employee/${id}`,{
        headers: {
          "Content-type": "application/json",
          "Authorization" : "Bearer " + localStorage.getItem("token")
        }
      });
      setEmployees(employees.filter((employee) => employee._id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalEmployees / limit);

  return (
    <>
      <Navbar />
      {admin && 
      <div className="mx-auto mt-8">
        <div className='flex justify-between items-center px-4'>
          <h2 className="text-lg font-semibold mb-4">Employee List</h2>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 mr-4"
            />
            <h2
              className="text-lg font-semibold mb-4 text-green-400 hover:cursor-pointer hover:text-green-500"
              onClick={() => navigate('/employeeform')}
            >
              Create Employee
            </h2>
          </div>
        </div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Unique ID</th>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Mobile No</th>
              <th className="py-2 px-4 border-b">Designation</th>
              <th className="py-2 px-4 border-b">Gender</th>
              <th className="py-2 px-4 border-b">Course</th>
              <th className="py-2 px-4 border-b">Create Date</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="py-2 px-4 border-b">{employee._id}</td>
                <td className="py-2 px-4 border-b">
                  {employee.imageUrl && <img src={'http://localhost:3000' + employee.imageUrl} className="w-16 h-16 object-cover" />}
                </td>
                <td className="py-2 px-4 border-b">{employee.name}</td>
                <td className="py-2 px-4 border-b">{employee.email}</td>
                <td className="py-2 px-4 border-b">{employee.mobile}</td>
                <td className="py-2 px-4 border-b">{employee.designation}</td>
                <td className="py-2 px-4 border-b">{employee.gender}</td>
                <td className="py-2 px-4 border-b">{employee.courses.join(', ')}</td>
                <td className="py-2 px-4 border-b">{new Date(employee.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Previous
          </button>
          <span className="self-center">Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    }
    </>
  );
};

export default EmployeeList;

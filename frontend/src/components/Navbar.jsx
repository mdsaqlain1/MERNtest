import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL_API } from '../../global';

const BASE_URL = BASE_URL_API;
const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`${BASE_URL}/me`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
    .then((res) => {
      setUsername(res.data.username);
    })
    .catch((err) => {
      console.error("Error fetching user data:", err);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
    window.location.reload();
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
      {/* Home */}
      <div>
        <div onClick={()=> navigate('/home')} className="text-lg font-medium text-gray-800 hover:text-blue-600 hover:cursor-pointer">Home</div>
      </div>

      {/* Employee List Button */}
      <div>
      <div onClick={()=> navigate('/employes')} className="text-lg font-medium text-gray-800 hover:text-blue-600 hover:cursor-pointer">Employee List</div>
      </div>

      {/* Username and Logout */}
      <div>
        {username ? (
          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium text-gray-800">{username} - </span>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        ) : (
          <p onClick={()=> navigate('/login')} className="text-lg font-medium text-blue-600 hover:underline">Login</p>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

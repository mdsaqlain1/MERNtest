import axios from "axios";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL_API } from '../../global';

const BASE_URL = BASE_URL_API;

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) navigate('/login')
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
  }, [username]);

  return (
    <div>
      <Navbar />
      {username ? (
        <>
          <div className="px-4">
            Dashboard
          </div>
          <div className="flex justify-center font-bold h-40 items-center">
            Welcome Admin Panel			
          </div>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Home;

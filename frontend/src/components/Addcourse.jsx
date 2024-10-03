import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL_API } from "../../global";
import Navbar from "./Navbar";

export const AddCourse = () => {
  const [admin, setAdmin] = useState(null);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(()=>{
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`${BASE_URL_API}/me`, {
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        });
        setAdmin(response.data);
      } catch (error) {
        console.error('Error fetching admin:', error);
      }
    };
    fetchAdmin();
  }, [])

  useEffect(() => {
    axios
      .get(`${BASE_URL_API}/courses`,{
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }
      )
      .then((res) => {
        setCourses(res.data[0]?.courses || []);
      })
      .catch((error) => {
        console.error("Error fetching courses: ", error);
      });
  }, []);

  const addCourse = () => {
    if (!course.trim()) return;

    const updatedCourses = [...courses, course];

    axios
      .post(`${BASE_URL_API}/courses`, { courses: updatedCourses },{
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }
      )
      .then((res) => {
        if (res.status == 200) {
          setCourses(updatedCourses);
          console.log("Courses updated successfully: ", res.data);
        }
      })
      .catch((error) => {
        console.error("Error updating courses: ", error);
      });

    // Clear input after adding
    setCourse("");
  };

  // Function to handle deleting a course
  const deleteCourse = (index) => {
    const courseToDelete = courses[index];
    const updatedCourses = courses.filter((_, i) => i !== index);

    setCourses(updatedCourses);

    axios
      .delete(`${BASE_URL_API}/courses/${courseToDelete}`)
      .then((res) => {
        console.log("Course deleted successfully: ", res.data, {
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        });
      })
      .catch((error) => {
        console.error("Error deleting course: ", error);
      });
  };

  const editCourse = (index) => {
    setCourse(courses[index]);
    setEditIndex(index);
  };

  const saveCourse = () => {
    if (!course.trim()) return;

    const courseToEdit = courses[editIndex];
    const updatedCourses = [...courses];
    updatedCourses[editIndex] = course;

    setCourses(updatedCourses);

    axios
      .put(`${BASE_URL_API}/courses/${courseToEdit}`, { newCourseName: course })
      .then((res) => {
        console.log("Course updated successfully: ", res.data);
      })
      .catch((error) => {
        console.error("Error updating course: ", error);
      });

    // Clear input and reset edit index after saving
    setCourse("");
    setEditIndex(null);
  };

  return ( 
    <div>
      <Navbar />
      {admin &&
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-4">Manage Courses</h1>
          <div className="flex mb-4">
            <input
              type="text"
              id="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Add a new course"
              className="border border-gray-300 rounded-md p-2 flex-grow mr-2"
            />
            {editIndex !== null ? (
              <button
                onClick={saveCourse}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save Course
              </button>
            ) : (
              <button
                onClick={addCourse}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Add Course
              </button>
            )}
          </div>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border border-gray-300">Record No</th>
                <th className="px-4 py-2 border border-gray-300">Courses</th>
                <th className="px-4 py-2 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border border-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{c}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <button
                      onClick={() => editCourse(index)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCourse(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      }
      </div>
  )};

export default AddCourse;

import { useFormik } from 'formik';
import Navbar from './Navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL_API, BACKEND_URL_API } from '../../global';
import { employeeValidationSchema } from '../../../backend/validation';

const BASE_URL = BASE_URL_API;
const BACKEND_URL = BACKEND_URL_API;

const UpdateEmployee = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [employee, setEmployee] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/me`, {
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
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/employee/${id}`, {
          headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          }
        });

        let coursesArray;
        if (Array.isArray(response.data.courses)) {
          coursesArray = response.data.courses;
        } else if (typeof response.data.courses === 'string') {
          coursesArray = response.data.courses.split(',');
        } else {
          coursesArray = [];
        }

        setEmployee({ ...response.data, courses: coursesArray });
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };
    fetchEmployee();
  }, [id]);
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    console.log(formik.values.courses);
    if (checked) {
      formik.setFieldValue("courses", [...formik.values.courses, value]);
    } else {
      formik.setFieldValue(
        "courses",
        formik.values.courses.filter((course) => course !== value)
      );
    }
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: employee?.name || '',
      email: employee?.email || '',
      mobile: employee?.mobile || '',
      designation: employee?.designation || '',
      gender: employee?.gender || '',
      courses: employee?.courses || [],
      image: employee?.imageUrl || null,
    },
    validationSchema: employeeValidationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      if (values.image instanceof File) {
        formData.append('image', values.image);
      } else {
        formData.append('oldImage', employee.imageUrl);
      }

      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('mobile', values.mobile);
      formData.append('designation', values.designation);
      formData.append('gender', values.gender);

      values.courses.forEach((course, index) => {
        formData.append(`courses[${index}]`, course);
      });
      console.log("formdata",formData.getAll('courses'))
      axios.put(`${BASE_URL}/employee/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("Update successful:", response);
        navigate('/employes');
      })
      .catch((error) => {
        console.error("Error during update:", error);
      });
    }
  });


  return (
    <>
      <Navbar />
      {admin && employee && (
        <form onSubmit={formik.handleSubmit} className="p-6">
          {/* Name */}
          <div className="mt-4 flex items-center">
            <label htmlFor="name" className="w-32">Name:</label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="border p-2 max-w-xs flex-1"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500">{formik.errors.name}</div>
            ) : null}
          </div>

          {/* Email */}
          <div className="mt-4 flex items-center">
            <label htmlFor="email" className="w-32">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="border p-2 max-w-xs flex-1"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500">{formik.errors.email}</div>
            ) : null}
          </div>

          {/* Mobile */}
          <div className="mt-4 flex items-center">
            <label htmlFor="mobile" className="w-32">Mobile No:</label>
            <input
              id="mobile"
              name="mobile"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.mobile}
              className="border p-2 max-w-xs flex-1"
            />
            {formik.touched.mobile && formik.errors.mobile ? (
              <div className="text-red-500">{formik.errors.mobile}</div>
            ) : null}
          </div>

          {/* Designation */}
          <div className="mt-4 flex items-center">
            <label htmlFor="designation" className="w-32">Designation:</label>
            <select
              id="designation"
              name="designation"
              onChange={formik.handleChange}
              value={formik.values.designation}
              className="border p-2 max-w-xs flex-1"
            >
              <option value="">Select</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
            {formik.touched.designation && formik.errors.designation ? (
              <div className="text-red-500">{formik.errors.designation}</div>
            ) : null}
          </div>

          {/* Gender */}
          <div className="mt-4 flex items-center">
            <label className="w-32">Gender:</label>
            <div className="flex space-x-4 flex-1">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  onChange={formik.handleChange}
                  checked={formik.values.gender === 'M'}
                />
                M
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  onChange={formik.handleChange}
                  checked={formik.values.gender === 'F'}
                />
                F
              </label>
            </div>
            {formik.touched.gender && formik.errors.gender ? (
              <div className="text-red-500">{formik.errors.gender}</div>
            ) : null}
          </div>

          {/* Course */}
          <div className="mt-4 flex items-center">
            <label className="w-32">Courses:</label>
            <div className="flex space-x-4 flex-1">
              <label>
                <input
                  type="checkbox"
                  name="courses"
                  value="MCA"
                  onChange={handleCheckboxChange}
                  checked={formik.values.courses.includes('MCA')}
                />
                MCA
              </label>
              <label>
                <input
                  type="checkbox"
                  name="courses"
                  value="BCA"
                  onChange={handleCheckboxChange}
                  checked={formik.values.courses.includes('BCA')}
                />
                BCA
              </label>
              <label>
                <input
                  type="checkbox"
                  name="courses"
                  value="BSC"
                  onChange={handleCheckboxChange}
                  checked={formik.values.courses.includes('BSC')}
                />
                BSC
              </label>
            </div>
            {formik.touched.courses && formik.errors.courses && (
              <div className="text-red-500">{formik.errors.courses}</div>
            )}
          </div>
          {/* Display Existing Image */}
          <div className="mt-4 flex items-center">
            <label className="w-32">Current Image:</label>
            {formik.values.image && (
              <img
                src={`${BACKEND_URL}${formik.values.image}`} 
                className="border max-w-xs flex-1"
                style={{ maxWidth: '100px', maxHeight: '100px' }} 
              />
            )}
          </div>

          {/* Image Upload */}
          <div className="mt-4 flex items-center">
            <label htmlFor="image" className="w-32">Image Upload:</label>
            <input
              id="image"
              name="image"
              type="file"
              accept=".jpeg, .jpg, .png"
              onChange={(event) => {
                formik.setFieldValue("image", event.currentTarget.files[0]);
              }}
              onBlur={formik.handleBlur}  // Added onBlur
              className="border p-2 max-w-xs flex-1"
            />
            {formik.touched.image && formik.errors.image && (
              <div className="text-red-500">{formik.errors.image}</div>
            )}
          </div>

          {/* Submit */}
          <div className="mt-4">
            <button type="submit" className="bg-green-500 text-white px-4 py-2">
              Update
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default UpdateEmployee;

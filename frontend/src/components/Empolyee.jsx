import { useFormik } from 'formik';
import Navbar from './Navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL_API } from '../../global';
import { employeeValidationSchema } from '../../../backend/validation';
import { useNavigate } from 'react-router-dom';

const BASE_URL = BASE_URL_API;

const CreateEmployeeForm = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/me`, {
          headers: {
            "Content-Type": "application/json",
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

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      designation: '',
      gender: '',
      courses: [],
      image: null,
    },
    validationSchema: employeeValidationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }
      console.log("formdata",formData)
      axios.post(`${BASE_URL}/employee`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        navigate('/employes');
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    },
  });

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      formik.setFieldValue("courses", [...formik.values.courses, value]);
    } else {
      formik.setFieldValue(
        "courses",
        formik.values.courses.filter((course) => course !== value)
      );
    }
  };

  return (
    <>
      <Navbar />
      {admin && 
        <form onSubmit={formik.handleSubmit} className="p-6">
          {/* Name */}
          <div className="mt-4 flex items-center">
            <label htmlFor="name" className="w-32">Name:</label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}  // Added onBlur
              value={formik.values.name}
              className="border p-2 max-w-xs flex-1" 
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500">{formik.errors.name}</div>
            )}
          </div>

          {/* Email */}
          <div className="mt-4 flex items-center">
            <label htmlFor="email" className="w-32">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}  // Added onBlur
              value={formik.values.email}
              className="border p-2 max-w-xs flex-1"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500">{formik.errors.email}</div>
            )}
          </div>

          {/* Mobile */}
          <div className="mt-4 flex items-center">
            <label htmlFor="mobile" className="w-32">Mobile No:</label>
            <input
              id="mobile"
              name="mobile"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}  // Added onBlur
              value={formik.values.mobile}
              className="border p-2 max-w-xs flex-1"
            />
            {formik.touched.mobile && formik.errors.mobile && (
              <div className="text-red-500">{formik.errors.mobile}</div>
            )}
          </div>

          {/* Designation */}
          <div className="mt-4 flex items-center">
            <label htmlFor="designation" className="w-32">Designation:</label>
            <select
              id="designation"
              name="designation"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}  // Added onBlur
              value={formik.values.designation}
              className="border p-2 max-w-xs flex-1"
            >
              <option value="">Select</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
            {formik.touched.designation && formik.errors.designation && (
              <div className="text-red-500">{formik.errors.designation}</div>
            )}
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
                  onBlur={formik.handleBlur}  // Added onBlur
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
                  onBlur={formik.handleBlur}  // Added onBlur
                  checked={formik.values.gender === 'F'}
                />
                F
              </label>
            </div>
            {formik.touched.gender && formik.errors.gender && (
              <div className="text-red-500">{formik.errors.gender}</div>
            )}
          </div>

          {/* Courses */}
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

          {/* Submit Button */}
          <div className="mt-4">
            <button type="submit" className="bg-green-500 text-white px-4 py-2">
              Submit
            </button>
          </div>
        </form>
      }
    </>
  );
};

export default CreateEmployeeForm;

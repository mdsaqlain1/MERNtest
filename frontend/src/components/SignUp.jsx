import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {useNavigate} from 'react-router-dom'
import { BASE_URL_API } from '../../global';

const BASE_URL = BASE_URL_API;

const SignUp = () => {
  const navigate = useNavigate();
  const signUpSchema = Yup.object({
      username: Yup.string().required('Username is required').min(2, 'Username is too short'),
      password: Yup.string().required('Password is required').min(4, 'Password is too short'),
  });
  return (
    <div className='bg-gray-100 px-4'>
      <p>Signup Page</p>
    <div className="flex items-center justify-center min-h-[89vh] ">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          validationSchema={signUpSchema}
          onSubmit={values => {
            console.log(values);
            axios.post(`${BASE_URL}/signup`, values)
                .then(response => {
                    localStorage.setItem("token", response.data.token)
                    console.log(response);
                    navigate('/home')
                })
                .catch(error => {
                    console.log(error);
                    
                });
          }}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="username">Username</label>
                <Field
                  name="username"
                  className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-black h-10"
                />
                {errors.username && touched.username ? (
                  <div className="text-red-500 text-sm mt-1">{errors.username}</div>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                <Field
                  name="password"
                  type="password"
                  className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-black h-10"
                />
                {errors.password && touched.password ? (
                  <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                ) : null}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign Up
              </button>
            </Form>
          )}
        </Formik>
        <div className='py-2'>
          new user? <span onClick={()=> navigate("/login")} className="text-blue-500 hover:cursor-pointer">Login</span>
        </div>
      </div>
    </div>
    </div>
  );
}

export default SignUp;

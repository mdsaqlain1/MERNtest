import * as Yup from 'yup';

const adminValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const employeeValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters'),
  
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  
  designation: Yup.string()
    .oneOf(['HR', 'Manager', 'Sales'], 'Invalid designation')
    .required('Designation is required'),
  
  gender: Yup.string()
    .oneOf(['M', 'F'], 'Invalid gender')
    .required('Gender is required'),
  
  courses: Yup.array()
    .of(Yup.string())
    .min(1, 'Select at least one course')
    .required('Courses are required'),
  
  imageUrl: Yup.string()
    .nullable()  // Allow null or empty strings for imageUrl
    .url('Invalid image URL'),
});

export { adminValidationSchema, employeeValidationSchema };

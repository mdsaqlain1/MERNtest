import express from "express";
import { Employee, Admin, Course } from '../db/index.js';
import {SECRET, authenticateJwt} from '../middleware/index.js';
import { adminValidationSchema, employeeValidationSchema } from "../validation/index.js";
import jwt from "jsonwebtoken"
import multer from "multer";
import path from "path"

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Define your upload folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png)"));
    }
  }
});

router.post("/v1/signup", async (req, res) => {
  try {
    await adminValidationSchema.validate(req.body, { abortEarly: false });
    const admin = await Admin.findOne({ username: req.body.username })
    if (admin) {
    res.status(400).json({ message: "Username already exists" });
    } else {    
      const admin = new Admin({
      username: req.body.username,
      password: req.body.password,
    });
    admin.save().then(() => {
      const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: "1hr" });
      res.status(201).json({token, message: "Admin created" });
    });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/v1/login", async (req, res) => {
  try {
    await adminValidationSchema.validate(req.body, { abortEarly: false });
    const {username, password} = req.body;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: "1hr" });
      res.status(200).json({ token, message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/v1/me", authenticateJwt, (req, res) => {
    res.status(200).json(req.user);
});

router.post("/v1/employee",authenticateJwt, upload.single('image'), async (req, res) => {
  try {
    await employeeValidationSchema.validate(req.body, { abortEarly: false });
    const { name, email, mobile, designation, gender, courses } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const newEmployee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      courses,
      imageUrl,
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Get all users
router.get('/v1/employee',authenticateJwt, async (req, res) => {
  try {
    const { search, page = 1, limit = 5 } = req.query; 
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }, 
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const totalEmployees = await Employee.countDocuments(query); 
    const employees = await Employee.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit)); 

    res.status(200).json({
      total: totalEmployees,
      page: Number(page),
      limit: Number(limit),
      employees,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
});

// Get a specific user by ID
router.get("/v1/employee/:_id",authenticateJwt, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params._id);
    if (!employee) return res.status(404).json({ message: "employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user by ID
router.put("/v1/employee/:_id",authenticateJwt, upload.single('image'), async (req, res) => {
  try {
    await employeeValidationSchema.validate(req.body, { abortEarly: false });
    const { name, email, mobile, designation, gender, courses, oldImage } = req.body;
    
    // Get the new image URL if file is uploaded
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : oldImage;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params._id,
      { name, email, mobile, designation, gender, courses, imageUrl },
      { new: true }
    );

    if (!updatedEmployee) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", employee: updatedEmployee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user by ID
router.delete("/v1/employee/:_id",authenticateJwt, async (req, res) => {
  try {
    const deleteEmployee = await Employee.findByIdAndDelete(req.params._id);
    if (!deleteEmployee) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/v1/courses/",authenticateJwt, async (req, res) => {
  try {
    const { courses } = req.body; // Assuming req.body contains an array of new courses

    // Validate that 'courses' is an array
    if (!Array.isArray(courses)) {
      return res.status(400).json({ error: "Courses should be an array" });
    }

    // Find the existing document (assuming there's only one document for simplicity)
    const existingCourses = await Course.findOne(); // Adjust this if you have specific criteria

    if (existingCourses) {
      // Filter out courses that already exist in the array
      const newCourses = courses.filter(course => !existingCourses.courses.includes(course));

      // Only add non-duplicate courses
      if (newCourses.length > 0) {
        existingCourses.courses.push(...newCourses);
        await existingCourses.save();
        res.status(200).json({ message: "Courses added successfully", existingCourses });
      } else {
        res.status(201).json({ message: "No new courses to add. All courses already exist.", existingCourses });
      }
    } else {
      // If no document exists, create a new one
      const newCourse = new Course({ courses });
      await newCourse.save();
      res.status(200).json({ message: "Courses created successfully", newCourse });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get("/v1/courses/",authenticateJwt, async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses from the database
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/v1/courses/:courseName",authenticateJwt, async (req, res) => {
  try {
    const { courseName } = req.params;
    console.log(courseName)
    // Find the existing document (assuming there's only one document for simplicity)
    const existingCourses = await Course.findOne(); // Adjust this if you have specific criteria

    if (existingCourses) {
      // Filter out the course to be deleted
      const updatedCourses = existingCourses.courses.filter(course => course !== courseName);

      // Update the document with the new array
      existingCourses.courses = updatedCourses;
      await existingCourses.save();

      res.status(200).json({ message: "Course deleted successfully", existingCourses });
    } else {
      res.status(404).json({ error: "No courses found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/v1/courses/:courseName",authenticateJwt, async (req, res) => {
  try {
    const { courseName } = req.params;
    const { newCourseName } = req.body; // Assuming req.body contains the new course name

    // Find the existing document (assuming there's only one document for simplicity)
    const existingCourses = await Course.findOne(); // Adjust this if you have specific criteria

    if (existingCourses) {
      // Find the index of the course to be updated
      const courseIndex = existingCourses.courses.indexOf(courseName);

      if (courseIndex !== -1) {
        // Update the course name
        existingCourses.courses[courseIndex] = newCourseName;
        await existingCourses.save();

        res.status(200).json({ message: "Course updated successfully", existingCourses });
      } else {
        res.status(404).json({ error: "Course not found" });
      }
    } else {
      res.status(404).json({ error: "No courses found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
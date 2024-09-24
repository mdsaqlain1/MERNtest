import express from "express";
import { Employee, Admin } from '../db/index.js';
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
    console.log(req.body)
    const { name, email, mobile, designation, gender, courses } = req.body;
    console.log(req.body)
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    console.log(imageUrl);
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
    console.log(req.body.courses);
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

export default router;
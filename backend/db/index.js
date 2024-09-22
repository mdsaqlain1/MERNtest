import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
    },
    password : {
        type: String,
        required: true,
    },
});

const employeeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      enum: ["HR", "Manager", "Sales"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["M", "F"],
      required: true,
    },
    courses: {
      type: [String],
      required: true,
    },
    imageUrl: {
      type: String, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  // Create and export employee model
const Admin = mongoose.model.Admin || mongoose.model('Admin', LoginSchema);
const Employee = mongoose.model.Employee || mongoose.model('Employee', employeeSchema);

export { Admin, Employee };
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const studentSchema = new mongoose.Schema({
  name: String,
  major: String,
  gpa: Number
});

const Student = mongoose.model("Student", studentSchema, "students");

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: "Failed to save student" });
  }
});

app.post("/api/seed", async (req, res) => {
  try {
    await Student.deleteMany({});

    const sampleStudents = [
      { name: "John Smith", major: "Cybersecurity", gpa: 3.7 },
      { name: "Emily Johnson", major: "Computer Science", gpa: 3.9 },
      { name: "Michael Brown", major: "Information Technology", gpa: 3.4 },
      { name: "Sarah Davis", major: "Software Engineering", gpa: 3.8 },
      { name: "David Wilson", major: "Data Science", gpa: 3.6 }
    ];

    await Student.insertMany(sampleStudents);
    res.json({ message: "Inserted 5 student records" });
  } catch (error) {
    res.status(500).json({ error: "Failed to seed students" });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

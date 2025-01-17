const express = require("express");
const Employee = require("../models/EmployeeSchema");
const { body, validationResult } = require("express-validator");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/",
  [
    body("first_name").isString(),
    body("last_name").isString(),
    body("email").isEmail(),
    body("position").isString(),
    body("salary").isNumeric(),
    body("date_of_joining").isISO8601(),
    body("department").isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const employee = new Employee({ ...req.body });
      await employee.save();
      res.status(201).json({
        message: "Employee created successfully.",
        employee_id: employee._id,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.put("/:eid", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.eid,
      req.body,
      { new: true }
    );
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Employee details updated successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Employee.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/search", async (req, res) => {
  const { department, position } = req.query;
  console.log("Search parameters:", department, position);

  if (!department && !position) {
    return res.status(400).json({ message: "No search criteria provided" });
  }

  try {
    const query = {};
    if (department) query.department = { $regex: department, $options: "i" };
    if (position) query.position = { $regex: position, $options: "i" };

    const employees = await Employee.find(query);
    return res.status(200).json(employees);
  } catch (error) {
    console.error("Error in search route:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

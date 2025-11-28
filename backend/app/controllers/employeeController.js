const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        console.error("Error in getAllEmployees:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const { name, email, position, department, phone, skills } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        const employee = new Employee({
            name,
            email,
            position,
            department,
            phone,
            skills,
            password: hashedPassword,
            role: 'Employee'
        });
        await employee.save();
        res.status(201).json(employee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (req.body.name) employee.name = req.body.name;
        if (req.body.email) employee.email = req.body.email;
        if (req.body.position) employee.position = req.body.position;
        if (req.body.department) employee.department = req.body.department;
        if (req.body.phone) employee.phone = req.body.phone;
        if (req.body.skills) employee.skills = req.body.skills;
        if (req.body.dateJoined) employee.dateJoined = req.body.dateJoined;

        const updatedEmployee = await employee.save();
        res.json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        await employee.deleteOne();
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        console.error("Error in deleteEmployee:", err);
        res.status(500).json({ message: err.message });
    }
};

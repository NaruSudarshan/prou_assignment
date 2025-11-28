const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, position, department, phone, skills } = req.body;

        const userExists = await Employee.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const employee = await Employee.create({
            name,
            email,
            password: hashedPassword,
            position,
            department,
            phone,
            skills,
            role: 'Manager'
        });

        if (employee) {
            const token = generateToken(employee._id);
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            res.status(201).json({
                _id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const employee = await Employee.findOne({ email });

        if (employee && (await bcrypt.compare(password, employee.password))) {
            const token = generateToken(employee._id);
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            res.json({
                _id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.logout = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out' });
};

exports.getMe = async (req, res) => {
    try {
        const employee = await Employee.findById(req.user.id).select('-password');
        res.json(employee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const employee = await Employee.findById(req.user.id);

        if (!employee) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(newPassword, salt);
        await employee.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

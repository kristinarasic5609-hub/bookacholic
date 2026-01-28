const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const validateUser = [
    body('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .trim(),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters'),
    body('age')
        .optional()
        .isInt({ min: 13, max: 120 })
        .withMessage('Age must be between 13 and 120'),
    body('gender')
        .optional()
        .isIn(['male', 'female', 'other'])
        .withMessage('Gender must be male, female, or other')
];

const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'username';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        const users = await User.find({})
            .select('-password')
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();

        res.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
    
        let user = await User.findOne({ id: req.params.id }).select('-password');

      
        if (!user) {
            try {
                user = await User.findById(req.params.id).select('-password');
            } catch (mongoIdErr) {
               
            }
        }

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                age: user.age,
                gender: user.gender,
                currentlyReading: user.currentlyReading,
                wantToRead: user.wantToRead,
                finished: user.finished
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', validateUser, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { username, email, password, age, gender } = req.body;

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Username or email already exists'
            });
        }

        const newUser = new User({
            id: Date.now().toString(),
            username,
            email,
            password,
            age,
            gender,
            role: 'user',
            currentlyReading: [],
            wantToRead: [],
            finished: []
        });

        const savedUser = await newUser.save();
        const token = generateToken(savedUser._id);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: savedUser.id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role,
                age: savedUser.age,
                gender: savedUser.gender,
                currentlyReading: savedUser.currentlyReading,
                wantToRead: savedUser.wantToRead,
                finished: savedUser.finished
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', validateUser, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { password, ...updateData } = req.body;
        const updateFields = { ...updateData };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findOneAndUpdate(
            { id: req.params.id },
            updateFields,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id/reading-lists', async (req, res) => {
    try {
        const { currentlyReading, wantToRead, finished } = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { id: req.params.id },
            {
                currentlyReading: currentlyReading || [],
                wantToRead: wantToRead || [],
                finished: finished || []
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ id: req.params.id });
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/simple-update', async (req, res) => {
    try {
        const updateFields = {};

        if (req.body.username) updateFields.username = req.body.username;
        if (req.body.email) updateFields.email = req.body.email;
        if (req.body.age) updateFields.age = parseInt(req.body.age);
        if (req.body.gender) updateFields.gender = req.body.gender;

        if (req.body.password && req.body.password.trim() !== '') {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await User.findOneAndUpdate(
            { id: req.params.id },
            updateFields,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const safeUser = {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            age: updatedUser.age,
            gender: updatedUser.gender,
            role: updatedUser.role,
            currentlyReading: updatedUser.currentlyReading || [],
            wantToRead: updatedUser.wantToRead || [],
            finished: updatedUser.finished || []
        };

        res.json(safeUser);
    } catch (err) {
        res.status(500).json({ message: 'Update failed: ' + err.message });
    }
});

router.post('/create-admin', async (req, res) => {
    try {
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.json({ message: 'Admin user already exists', admin: existingAdmin.username });
        }

        const adminUser = new User({
            id: 'admin-' + Date.now(),
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin', 
            age: 30,
            gender: 'male',
            role: 'admin',
            currentlyReading: [],
            wantToRead: [],
            finished: []
        });

        await adminUser.save();

        res.json({
            message: 'Admin user created successfully!',
            username: 'admin',
            password: 'admin'
        });
    } catch (err) {
        res.status(500).json({ message: 'Error creating admin: ' + err.message });
    }
});

module.exports = router;
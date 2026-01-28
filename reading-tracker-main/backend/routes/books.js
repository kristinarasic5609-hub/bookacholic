const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const Book = require('../models/Book');

const router = express.Router();

const validateBook = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('author')
        .notEmpty()
        .withMessage('Author is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Author name must be between 1 and 100 characters'),
    body('genre')
        .notEmpty()
        .withMessage('Genre is required'),
    body('year')
        .isInt({ min: -3000, max: new Date().getFullYear() + 5 })
        .withMessage('Please provide a valid year'),
    body('rating')
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage('Rating must be between 0 and 5'),
    body('pages')
        .optional()
        .isInt({ min: 1, max: 10000 })
        .withMessage('Pages must be between 1 and 10000'),
    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters')
];

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'title';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        const filter = {};
        if (req.query.genre) {
            filter.genre = new RegExp(req.query.genre, 'i');
        }
        if (req.query.author) {
            filter.author = new RegExp(req.query.author, 'i');
        }
        if (req.query.minRating) {
            filter.rating = { $gte: parseFloat(req.query.minRating) };
        }

        const books = await Book.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        const total = await Book.countDocuments(filter);

        res.json({
            books,
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
        const book = await Book.findOne({ id: req.params.id });
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', authenticateToken, validateBook, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const newBook = new Book(req.body);

        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', authenticateToken, requireRole(['admin']), validateBook, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const updatedBook = await Book.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const deletedBook = await Book.findOneAndDelete({ id: req.params.id });
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    getTodos,
    createTodo,
    getTodoById,
    updateTodo,
    deleteTodo,
} = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

// Routes for /api/todos
router.route('/').get(protect, getTodos).post(protect, createTodo);

// Routes for /api/todos/:id
router.route('/:id').get(protect, getTodoById).put(protect, updateTodo).delete(protect, deleteTodo);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    getTodos,
    createTodo,
    getTodoById,
    updateTodo,
    deleteTodo,
} = require('../controllers/todoController');

// Routes for /api/todos
router.route('/').get(getTodos).post(createTodo);

// Routes for /api/todos/:id
router.route('/:id').get(getTodoById).put(updateTodo).delete(deleteTodo);

module.exports = router;

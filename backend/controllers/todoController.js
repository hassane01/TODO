const asyncHandler = require('express-async-handler');
const Todo = require('../models/todoModel');
const User = require('../models/userModel'); // Import User model

// @desc    Get all todos
// @route   GET /api/todos
// @access  Public
const getTodos = asyncHandler(async (req, res) => {
    const todos = await Todo.find({ user: req.user.id });
    res.status(200).json(todos);
});

// @desc    Create a todo
// @route   POST /api/todos
// @access  Public
const createTodo = asyncHandler(async (req, res) => {
    console.log('Creating todo:', req.body, req.user);
    const { title } = req.body;

    if (!title) {
        res.status(400);
        throw new Error('Please add a title');
    }

    const todo = await Todo.create({
        title,
        user: req.user.id,
        completed: false,
    });
    res.status(201).json(todo);
});

// @desc    Get a single todo
// @route   GET /api/todos/:id
// @access  Public




const getTodoById = asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        res.status(404);
        throw new Error('Todo not found');
    }

    // Make sure the logged in user matches the todo user
    if (todo.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    res.status(200).json(todo);
});

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Public





const updateTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        res.status(404);
        throw new Error('Todo not found');
    }

    // Make sure the logged in user matches the todo user
    if (todo.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedTodo);
});

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Public





const deleteTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        res.status(404);
        throw new Error('Todo not found');
    }

    // Make sure the logged in user matches the todo user
    if (todo.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await todo.deleteOne(); // Use deleteOne() instead of findByIdAndDelete() for consistency with Mongoose 6+

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getTodos,
    createTodo,
    getTodoById,
    updateTodo,
    deleteTodo,
};

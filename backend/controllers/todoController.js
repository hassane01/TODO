const asyncHandler = require('express-async-handler');
const Todo = require('../models/todoModel');
const { validationResult } = require('express-validator');
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array().map(err => err.msg).join(', '));
    }
  
    const { title } = req.body;

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
    const updatedTodo = await Todo.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id }, // Atomically find by ID and user
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedTodo) {
        res.status(404);
        // If no todo is found, it's either non-existent or the user is not authorized.
        // A 404 is a safe and common response for both cases.
        throw new Error('Todo not found or user not authorized');
    }

    res.status(200).json(updatedTodo);
});

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private

const deleteTodo = asyncHandler(async (req, res) => {
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!deletedTodo) {
        res.status(404);
        throw new Error('Todo not found or user not authorized');
    }

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getTodos,
    createTodo,
    getTodoById,
    updateTodo,
    deleteTodo,
};

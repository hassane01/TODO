const {
  getTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');
const Todo = require('../models/todoModel');
const { validationResult } = require('express-validator');

// Mock dependencies
jest.mock('../models/todoModel');
jest.mock('express-validator');

describe('Todo Controller', () => {
  let req, res, next;
  const testUserId = 'user123';

  beforeEach(() => {
    req = {
      user: { id: testUserId },
      body: {},
      params: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTodos', () => {
    it('should get all todos for the logged-in user', async () => {
      const todos = [{ title: 'Test Todo 1' }, { title: 'Test Todo 2' }];
      Todo.find.mockResolvedValue(todos);

      await getTodos(req, res, next);

      expect(Todo.find).toHaveBeenCalledWith({ user: testUserId });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todos);
    });
  });

  describe('createTodo', () => {
    it('should create a new todo successfully', async () => {
      req.body.title = 'New Todo';
      const newTodo = { title: 'New Todo', user: testUserId, completed: false };

      validationResult.mockReturnValue({ isEmpty: () => true });
      Todo.create.mockResolvedValue(newTodo);

      await createTodo(req, res, next);

      expect(Todo.create).toHaveBeenCalledWith({
        title: 'New Todo',
        user: testUserId,
        completed: false,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newTodo);
    });

    it('should return a 400 error if validation fails', async () => {
      const errors = {
        isEmpty: () => false,
        array: () => [{ msg: 'Title is required' }],
      };
      validationResult.mockReturnValue(errors);

      await createTodo(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Title is required');
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getTodoById', () => {
    it('should get a single todo if it belongs to the user', async () => {
      const todoId = 'todo123';
      req.params.id = todoId;
      const todo = { _id: todoId, title: 'My Todo', user: { toString: () => testUserId } };

      Todo.findById.mockResolvedValue(todo);

      await getTodoById(req, res, next);

      expect(Todo.findById).toHaveBeenCalledWith(todoId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(todo);
    });

    it('should return a 404 error if todo is not found', async () => {
      req.params.id = 'nonexistent';
      Todo.findById.mockResolvedValue(null);

      await getTodoById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Todo not found');
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return a 401 error if the todo does not belong to the user', async () => {
      const todoId = 'todo123';
      req.params.id = todoId;
      const todo = { _id: todoId, title: 'Another User\'s Todo', user: { toString: () => 'otherUser' } };

      Todo.findById.mockResolvedValue(todo);

      await getTodoById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('User not authorized');
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('updateTodo', () => {
    it('should update a todo successfully', async () => {
      const todoId = 'todo123';
      req.params.id = todoId;
      req.body = { title: 'Updated Title', completed: true };
      const updatedTodo = { ...req.body, _id: todoId };

      Todo.findOneAndUpdate.mockResolvedValue(updatedTodo);

      await updateTodo(req, res, next);

      expect(Todo.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: todoId, user: testUserId },
        req.body,
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTodo);
    });

    it('should return a 404 error if todo to update is not found or user is not authorized', async () => {
      req.params.id = 'nonexistent';
      Todo.findOneAndUpdate.mockResolvedValue(null);

      await updateTodo(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Todo not found or user not authorized');
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo successfully', async () => {
      const todoId = 'todo123';
      req.params.id = todoId;

      Todo.findOneAndDelete.mockResolvedValue({ _id: todoId }); // Simulate successful deletion

      await deleteTodo(req, res, next);

      expect(Todo.findOneAndDelete).toHaveBeenCalledWith({ _id: todoId, user: testUserId });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: todoId });
    });

    it('should return a 404 error if todo to delete is not found or user is not authorized', async () => {
      req.params.id = 'nonexistent';
      Todo.findOneAndDelete.mockResolvedValue(null);

      await deleteTodo(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Todo not found or user not authorized');
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
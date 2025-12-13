const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust if your app export is different
const User = require('../models/userModel');
const Todo = require('../models/todoModel');

describe('Todo API - /api/todos', () => {
  let token;
  let userId;

  beforeAll(async () => {
    const testMongoUri = process.env.MONGO_URI_TEST;
    if (!testMongoUri) {
      throw new Error('MONGO_URI_TEST is not defined in your .env file');
    }
    await mongoose.connect(testMongoUri);
  });

  beforeEach(async () => {
    // Clean up database before each test
    await User.deleteMany({});
    await Todo.deleteMany({});

    // Create a user and get a token for authenticated requests
    const userResponse = await request(app)
      .post('/api/users')
      .send({
        name: 'Todo User',
        email: 'todo@example.com',
        password: 'password123',
      });
    
    token = userResponse.body.token;
    userId = userResponse.body._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/todos', () => {
    it('should create a new todo for an authenticated user', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'My First Todo' })
        .expect(201);

      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe('My First Todo');
      expect(res.body.user).toBe(userId);
    });

    it('should return 401 if no token is provided', async () => {
      await request(app)
        .post('/api/todos')
        .send({ title: 'This should fail' })
        .expect(401);
    });

    it('should return 400 if title is missing', async () => {
      await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '' }) // Invalid data
        .expect(400);
    });
  });

  describe('GET /api/todos', () => {
    it('should get all todos for the authenticated user', async () => {
      // Create some todos for the user
      await Todo.create({ title: 'Todo 1', user: userId });
      await Todo.create({ title: 'Todo 2', user: userId });
      // Create a todo for another user to ensure it's not returned
      await Todo.create({ title: 'Other User Todo', user: new mongoose.Types.ObjectId() });

      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(2);
      expect(res.body[0].title).toBe('Todo 1');
    });
  });

  describe('GET /api/todos/:id', () => {
    it('should get a single todo by its ID', async () => {
      const todo = await Todo.create({ title: 'Specific Todo', user: userId });

      const res = await request(app)
        .get(`/api/todos/${todo._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.title).toBe('Specific Todo');
    });

    it('should return 401 if trying to get another user\'s todo', async () => {
      const otherUsersTodo = await Todo.create({ title: 'Secret Todo', user: new mongoose.Types.ObjectId() });

      await request(app)
        .get(`/api/todos/${otherUsersTodo._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a user\'s own todo', async () => {
      const todo = await Todo.create({ title: 'To be updated', user: userId });

      const res = await request(app)
        .put(`/api/todos/${todo._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Title', completed: true })
        .expect(200);

      expect(res.body.title).toBe('Updated Title');
      expect(res.body.completed).toBe(true);
    });

    it('should return 404 when trying to update another user\'s todo', async () => {
        const otherUsersTodo = await Todo.create({ title: 'Do not touch', user: new mongoose.Types.ObjectId() });
  
        await request(app)
          .put(`/api/todos/${otherUsersTodo._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ title: 'Hacked' })
          .expect(404); // The controller returns 404 in this case
      });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a user\'s own todo', async () => {
      const todo = await Todo.create({ title: 'To be deleted', user: userId });

      const res = await request(app)
        .delete(`/api/todos/${todo._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe(todo._id.toString());

      // Verify it's actually gone from the DB
      const deletedTodo = await Todo.findById(todo._id);
      expect(deletedTodo).toBeNull();
    });
  });
});

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/userModel');
const Todo = require('../../models/todoModel');

describe('Todo API - /api/todos', () => {
  let token;
  let userId; 
  
  beforeAll(async () => {
    const testMongoUri = process.env.MONGO_URI_TEST;
    await mongoose.connect(testMongoUri);
  });
  
  beforeEach(async () => {
    // Clean up database before each test to ensure isolation
    await User.deleteMany({});
    await Todo.deleteMany({});

    // Create a fresh user and get a token for each test
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
        .send({ title: 'My first test todo' })
        .expect(201);

      expect(res.body.title).toBe('My first test todo');
    });

    it('should return 401 if no token is provided', async () => {
      await request(app)
        .post('/api/todos')
        .send({ title: 'This should fail' })
        .expect(401);
    });
  });

  describe('GET /api/todos', () => {
    it('should get all todos for the authenticated user', async () => {
      // Create a todo first
      await Todo.create({ title: 'A todo to get', user: userId }); 

      const res = await request(app).get('/api/todos').set('Authorization', `Bearer ${token}`).expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('A todo to get');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a todo for the authenticated user', async () => {
      // Create a todo to update
      const todo = await Todo.create({ title: 'To be updated', user: userId });

      const updatedData = { title: 'I have been updated', completed: true };

      const res = await request(app)
        .put(`/api/todos/${todo._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
        .expect(200);

      expect(res.body.title).toBe(updatedData.title);
      expect(res.body.completed).toBe(updatedData.completed);
    });

    it('should return 404 when trying to update a todo that does not belong to the user', async () => {
      const todo = await Todo.create({ title: 'Original User Todo', user: new mongoose.Types.ObjectId() });
      // Try to update the original user's todo with the second user's token
      await request(app)
        .put(`/api/todos/${todo._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'This should fail' })
        .expect(404); // Expect 404 as per our controller logic
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo for the authenticated user', async () => {
      // Create a todo to delete
      const todo = await Todo.create({ title: 'To be deleted', user: userId });

      const res = await request(app)
        .delete(`/api/todos/${todo._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe(todo._id.toString());

      const deletedTodo = await Todo.findById(todo._id);
      expect(deletedTodo).toBeNull();
    });
  });
});
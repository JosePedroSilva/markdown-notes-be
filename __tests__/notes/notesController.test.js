const request = require('supertest');
const app = require('../../src/app');

describe('Notes API Tests', () => {
  let token;
  let noteId;

  beforeAll(async () => {
    // Register a test user and get the token
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'notes@example.com', password: 'password123' });

    token = res.body.data.token;
  });

  // ✅ Test: Create a new note
  it('should create a note', async () => {
    const res = await request(app)
      .post('/api/v1/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Note', content: 'This is a test note' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.title).toBe('Test Note');
    expect(res.body.data.content).toBe('This is a test note');

    // Store the note ID for later tests
    noteId = res.body.data.id;
  });

  // ✅ Test: Fetch the created note by ID
  it('should retrieve the created note', async () => {
    const res = await request(app)
      .get(`/api/v1/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('id', noteId);
    expect(res.body.data.title).toBe('Test Note');
    expect(res.body.data.content).toBe('This is a test note');
  });

  // ✅ Test: Return 404 if the note is not found
  it('should return 404 if note not found', async () => {
    const res = await request(app)
      .get('/api/v1/notes/non-existing-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  // ✅ Test: Retrieve all notes overview
  it('should retrieve all notes for a user', async () => {
    const res = await request(app)
      .get('/api/v1/notes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  // ✅ Test: Update an existing note
  it('should update a note successfully', async () => {
    const res = await request(app)
      .put(`/api/v1/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Test Note', content: 'Updated content' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.message).toBe('Note updated');
  });

  // ✅ Test: Return 400 for invalid input type
  it('should return 400 for invalid input type when updating a note', async () => {
    const res = await request(app)
      .put(`/api/v1/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 1234, content: undefined });

    expect(res.statusCode).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  // ✅ Test: Return 401 if no token is provided
  it('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .post('/api/v1/notes')
      .send({ title: 'Unauthorized Note', content: 'No auth' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error.message).toBe('Missing or invalid authorization header');
  });

  // ✅ Test: Delete the created note
  it('should delete a note successfully', async () => {
    const res = await request(app)
      .delete(`/api/v1/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });

  // ✅ Test: Return 404 if trying to delete a non-existing note
  it('should return 404 if trying to delete a non-existing note', async () => {
    const res = await request(app)
      .delete('/api/v1/notes/non-existing-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

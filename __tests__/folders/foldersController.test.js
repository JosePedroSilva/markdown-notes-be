const request = require('supertest');
const app = require('../../src/app');

describe('Folders API Tests', () => {
  let token;
  let folderId;

  beforeAll(async () => {
    // Register a test user and get the token
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'folders@example.com', password: 'password123' });

    token = res.body.data.token;
  });

  // ✅ Test: Create a new folder
  it('should create a folder', async () => {
    const res = await request(app)
      .post('/api/v1/folders')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Folder' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toBe('Test Folder');

    // Store the folder ID for later tests
    folderId = res.body.data.id;
  });

  // ✅ Test: Update an existing folder
  it('should update a folder successfully', async () => {
    const res = await request(app)
      .put(`/api/v1/folders/${folderId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Folder Name' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.message).toBe('Folder updated successfully');
  });

  // ✅ Test: Return 400 for invalid input type
  it('should return 400 for invalid input type when updating a folder', async () => {
    const res = await request(app)
      .put(`/api/v1/folders/${folderId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 1234 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  // ✅ Test: Return 401 if no token is provided
  it('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .post('/api/v1/folders')
      .send({ name: 'Unauthorized Folder' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error.message).toBe('Missing or invalid authorization header');
  });

  // ✅ Test: Delete the created folder
  it('should delete a folder successfully', async () => {
    const res = await request(app)
      .delete(`/api/v1/folders/${folderId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });

  // ✅ Test: Return 404 if trying to delete a non-existing folder
  it('should return 404 if trying to delete a non-existing folder', async () => {
    const res = await request(app)
      .delete('/api/v1/folders/non-existing-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

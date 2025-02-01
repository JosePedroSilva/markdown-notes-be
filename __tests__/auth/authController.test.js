const request = require('supertest');
const app = require('../../src/app'); // Import Express app

describe('Auth API Tests', () => {
  it('should register a user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should return 400 if email or password is missing', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({ email: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error.message).toBe('Email or password not provided');
  });

  it('should not allow duplicate email registration', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'duplicate@example.com', password: 'password123' });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'duplicate@example.com', password: 'password456' });

    expect(res.statusCode).toBe(409);
    expect(res.body.error.message).toBe('Email already exists');
  });

  it('should allow login with correct credentials', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'login@example.com', password: 'password123' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@example.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should return 401 for incorrect password', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'wrongpass@example.com', password: 'password123' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'wrongpass@example.com', password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error.message).toBe('Invalid credentials');
  });
});

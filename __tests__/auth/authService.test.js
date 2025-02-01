const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const authService = require('../../src/services/authService');
const userQueries = require('../../src/services/queries/userQueries');
const generateAccessToken = require('../../src/utils/generateAccessToken');

jest.mock('../../src/services/queries/userQueries');
jest.mock('../../src/utils/generateAccessToken');

describe('Auth Service Tests', () => {
  const mockEmail = 'test@example.com';
  const mockPassword = 'password123';
  const mockHashedPassword = bcrypt.hashSync(mockPassword, 10);
  const mockUserId = crypto.randomUUID();
  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Test: Register user successfully
  it('should register a new user', async () => {
    userQueries.createUser.mockResolvedValue();
    generateAccessToken.mockReturnValue(mockToken);

    const result = await authService.registerUser(mockEmail, mockPassword);

    expect(userQueries.createUser).toHaveBeenCalledWith(
      expect.any(String),
      mockEmail,
      expect.any(String) // hashed password
    );
    expect(generateAccessToken).toHaveBeenCalledWith({
      id: expect.any(String),
      email: mockEmail,
    });
    expect(result).toEqual({
      token: mockToken,
      user: { id: expect.any(String), email: mockEmail },
    });
  });

  // ✅ Test: Login successfully
  it('should log in a user with valid credentials', async () => {
    userQueries.getUserByEmail.mockResolvedValue({
      id: mockUserId,
      email: mockEmail,
      password: mockHashedPassword,
    });

    generateAccessToken.mockReturnValue(mockToken);

    const result = await authService.login(mockEmail, mockPassword);

    expect(userQueries.getUserByEmail).toHaveBeenCalledWith(mockEmail);
    expect(generateAccessToken).toHaveBeenCalledWith({
      id: mockUserId,
      email: mockEmail,
    });
    expect(result).toEqual({
      token: mockToken,
      user: { id: mockUserId, email: mockEmail },
    });
  });

  // ✅ Test: Reject login for non-existent user
  it('should throw an error if user does not exist', async () => {
    userQueries.getUserByEmail.mockResolvedValue(null);

    await expect(authService.login(mockEmail, mockPassword)).rejects.toThrow(
      'User not found'
    );

    expect(userQueries.getUserByEmail).toHaveBeenCalledWith(mockEmail);
  });

  // ✅ Test: Reject login for incorrect password
  it('should throw an error for incorrect password', async () => {
    userQueries.getUserByEmail.mockResolvedValue({
      id: mockUserId,
      email: mockEmail,
      password: bcrypt.hashSync('wrongpassword', 10),
    });

    await expect(authService.login(mockEmail, mockPassword)).rejects.toThrow(
      'User not found'
    );

    expect(userQueries.getUserByEmail).toHaveBeenCalledWith(mockEmail);
  });

  // ✅ Test: Reject duplicate email registration
  it('should throw an error when registering with an existing email', async () => {
    userQueries.createUser.mockRejectedValue(new Error('User already exists'));

    await expect(
      authService.registerUser(mockEmail, mockPassword)
    ).rejects.toThrow('User already exists');

    expect(userQueries.createUser).toHaveBeenCalledWith(
      expect.any(String),
      mockEmail,
      expect.any(String)
    );
  });
});

const User = require('../src/models/User');

describe('User Model', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      });

      expect(user._id).toBeDefined();
      expect(user.firstName).toBe('John');
      expect(user.role).toBe('agent');
      expect(user.status).toBe('active');
    });

    it('should hash password on save', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'plaintext'
      });

      // Get password directly from database with select
      const savedUser = await User.findById(user._id).select('+password');
      expect(savedUser.password).not.toBe('plaintext');
    });

    it('should not allow duplicate emails', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      await User.create(userData);

      expect(async () => {
        await User.create(userData);
      }).rejects.toThrow();
    });

    it('should require email', async () => {
      const invalidUser = {
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      };

      expect(async () => {
        await User.create(invalidUser);
      }).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const invalidUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      expect(async () => {
        await User.create(invalidUser);
      }).rejects.toThrow();
    });
  });

  describe('Password Comparison', () => {
    let user;

    beforeEach(async () => {
      user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      });
    });

    it('should compare passwords correctly', async () => {
      const isMatch = await user.comparePassword('password123');
      expect(isMatch).toBe(true);
    });

    it('should not match incorrect password', async () => {
      const isMatch = await user.comparePassword('wrongpassword');
      expect(isMatch).toBe(false);
    });
  });

  describe('User Virtuals and Methods', () => {
    let user;

    beforeEach(async () => {
      user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      });
    });

    it('should return full name virtual', () => {
      expect(user.fullName).toBe('John Doe');
    });

    it('should exclude password from toJSON', () => {
      const userJSON = user.toJSON();
      expect(userJSON.password).toBeUndefined();
    });

    it('should include email in toJSON', () => {
      const userJSON = user.toJSON();
      expect(userJSON.email).toBe('john@example.com');
    });
  });

  describe('User Roles', () => {
    it('should accept valid roles', async () => {
      const agentUser = await User.create({
        firstName: 'Agent',
        lastName: 'User',
        email: 'agent@example.com',
        password: 'password123',
        role: 'agent'
      });

      const managerUser = await User.create({
        firstName: 'Manager',
        lastName: 'User',
        email: 'manager@example.com',
        password: 'password123',
        role: 'manager'
      });

      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });

      expect(agentUser.role).toBe('agent');
      expect(managerUser.role).toBe('manager');
      expect(adminUser.role).toBe('admin');
    });

    it('should reject invalid roles', async () => {
      const invalidUser = {
        firstName: 'Invalid',
        lastName: 'User',
        email: 'invalid@example.com',
        password: 'password123',
        role: 'superuser'
      };

      expect(async () => {
        await User.create(invalidUser);
      }).rejects.toThrow();
    });
  });

  describe('User Status', () => {
    it('should accept valid statuses', async () => {
      const activeUser = await User.create({
        firstName: 'Active',
        lastName: 'User',
        email: 'active@example.com',
        password: 'password123',
        status: 'active'
      });

      expect(activeUser.status).toBe('active');
    });

    it('should default to active status', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      });

      expect(user.status).toBe('active');
    });
  });
});

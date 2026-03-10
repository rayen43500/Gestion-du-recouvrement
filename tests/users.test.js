const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const { generateToken } = require('../src/config/jwt');

describe('User Routes', () => {
  let adminUser;
  let managerUser;
  let agentUser;
  let adminToken;
  let managerToken;
  let agentToken;

  beforeEach(async () => {
    await User.deleteMany({});

    // Create test users
    adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    managerUser = await User.create({
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@example.com',
      password: 'password123',
      role: 'manager'
    });

    agentUser = await User.create({
      firstName: 'Agent',
      lastName: 'User',
      email: 'agent@example.com',
      password: 'password123',
      role: 'agent'
    });

    adminToken = generateToken(adminUser._id, adminUser.role);
    managerToken = generateToken(managerUser._id, managerUser.role);
    agentToken = generateToken(agentUser._id, agentUser.role);
  });

  describe('GET /users', () => {
    it('should get all users (admin only)', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should get all users (manager only)', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should not get users with agent role', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${agentToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should not get users without authentication', async () => {
      const res = await request(app)
        .get('/users');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should filter users by role', async () => {
      const res = await request(app)
        .get('/users?role=agent')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.every(u => u.role === 'agent')).toBe(true);
    });

    it('should filter users by status', async () => {
      const res = await request(app)
        .get('/users?status=active')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.every(u => u.status === 'active')).toBe(true);
    });

    it('should search users by name or email', async () => {
      const res = await request(app)
        .get('/users?search=admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should paginate users', async () => {
      const res = await request(app)
        .get('/users?page=1&limit=2')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(2);
    });
  });

  describe('GET /users/:id', () => {
    it('should get user by ID', async () => {
      const res = await request(app)
        .get(`/users/${agentUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(agentUser._id.toString());
    });

    it('should not return password in response', async () => {
      const res = await request(app)
        .get(`/users/${agentUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.body.data.password).toBeUndefined();
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid user ID', async () => {
      const res = await request(app)
        .get('/users/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /users/:id', () => {
    it('should update user information', async () => {
      const res = await request(app)
        .put(`/users/${agentUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'UpdatedAgent',
          phone: '+33612345678'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.firstName).toBe('UpdatedAgent');
      expect(res.body.data.phone).toBe('+33612345678');
    });

    it('should not allow duplicate email', async () => {
      const res = await request(app)
        .put(`/users/${agentUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'admin@example.com' // Already taken
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should allow admin to change user role', async () => {
      const res = await request(app)
        .put(`/users/${agentUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          role: 'manager'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.role).toBe('manager');
    });

    it('should not allow non-admin to change user role', async () => {
      const res = await request(app)
        .put(`/users/${agentUser._id}`)
        .set('Authorization', `Bearer ${agentToken}`)
        .send({
          role: 'manager'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow admin to change user status', async () => {
      const res = await request(app)
        .put(`/users/${agentUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'inactive'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('inactive');
    });

    it('should require at least one field to update', async () => {
      const res = await request(app)
        .put(`/users/${agentUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user (admin only)', async () => {
      const userToDelete = await User.create({
        firstName: 'Delete',
        lastName: 'Me',
        email: 'delete@example.com',
        password: 'password123'
      });

      const res = await request(app)
        .delete(`/users/${userToDelete._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify user is deleted
      const deletedUser = await User.findById(userToDelete._id);
      expect(deletedUser).toBeNull();
    });

    it('should not delete without admin role', async () => {
      const res = await request(app)
        .delete(`/users/${agentUser._id}`)
        .set('Authorization', `Bearer ${agentToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should not allow self-deletion', async () => {
      const res = await request(app)
        .delete(`/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('propre compte');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});

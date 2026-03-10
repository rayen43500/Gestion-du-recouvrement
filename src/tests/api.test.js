const request = require('supertest');
const express = require('express');
const paymentsRouter = require('../src/routes/payments');
const collectionsRouter = require('../src/routes/collections');
const statsRouter = require('../src/routes/stats');

const app = express();
app.use(express.json());
app.use('/payments', paymentsRouter);
app.use('/collections', collectionsRouter);
app.use('/stats', statsRouter);

describe('API Endpoints', () => {
  describe('Payments', () => {
    it('should return 400 for invalid payment', async () => {
      const res = await request(app)
        .post('/payments')
        .send({ amount: -10 });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('Collections', () => {
    it('should return 400 for invalid collection action', async () => {
      const res = await request(app)
        .post('/collections')
        .send({ actionType: 'invalid' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('Stats', () => {
    it('should return stats object', async () => {
      const res = await request(app)
        .get('/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('payments');
      expect(res.body).toHaveProperty('invoices');
      expect(res.body).toHaveProperty('collections');
    });
  });
});

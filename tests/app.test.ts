import request from 'supertest';
import app from '../src/app';

describe('Sanity test', () => {
  test('GET / should return Inventory Management Server is Running!', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Inventory Management Server is Running');
  });
});

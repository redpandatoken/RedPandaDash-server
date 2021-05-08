import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import Server from '../server';

describe('Stats', () => {
  it('should get all stats', () =>
    request(Server)
      .get('/api/v1/stats')
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body).to.be.an('object');
      }));
});

import { Application } from 'express';
import { statsRouter } from './api/controllers/stats/router';
import apicache from 'apicache';
const cache = apicache.middleware;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onlyStatus200 = (_: any, res: any) => res.statusCode === 200;
const cacheSuccesses = cache('30 seconds', onlyStatus200);

export default function routes(app: Application): void {
  app.use('/api/v1/stats', cacheSuccesses, statsRouter);
}

import express from 'express';
import controller from './controller';
export const statsRouter = express.Router().get('/', controller.all);

import StatsService from '../../services/stats-service';
import { Request, Response } from 'express';

export class Controller {
  all(_: Request, res: Response): void {
    StatsService.get().then((r) => res.json(r));
  }
}
export default new Controller();

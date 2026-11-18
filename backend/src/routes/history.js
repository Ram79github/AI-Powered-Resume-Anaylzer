import { Router } from 'express';
import * as controller from '../controllers/history.js';
import { authenticate } from '../middleware/authenticate.js';
import { historyQuerySchema } from '../validators/analysis.js';

const router = Router();

router.get('/', authenticate, (req, _res, next) => {
  try {
    req.validatedQuery = historyQuerySchema.parse(req.query);
    next();
  } catch (error) {
    next(error);
  }
}, controller.list);
router.get('/:id', authenticate, controller.getOne);
router.delete('/:id', authenticate, controller.remove);

export default router;

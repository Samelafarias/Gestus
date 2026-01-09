import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { authMiddleware } from '../middlewares/auth.middleware';

const reportRouter = Router();
const reportController = new ReportController();

reportRouter.use(authMiddleware);

reportRouter.get('/summary', reportController.getSummary);
reportRouter.get('/projection', reportController.getProjection);

export default reportRouter;
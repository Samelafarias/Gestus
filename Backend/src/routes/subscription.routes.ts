// src/routes/subscription.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { SubscriptionController } from '../controllers/SubscriptionController';

const subscriptionRouter = Router();
const subscriptionController = new SubscriptionController();

// Aplica o middleware em todas as rotas de assinatura
subscriptionRouter.use(authMiddleware);

subscriptionRouter.post('/', subscriptionController.create);
subscriptionRouter.get('/', subscriptionController.list);
subscriptionRouter.patch('/:id/status', subscriptionController.updateStatus);
subscriptionRouter.patch('/:id/pay', subscriptionController.pay);
subscriptionRouter.put('/:id', subscriptionController.update);

export default subscriptionRouter;
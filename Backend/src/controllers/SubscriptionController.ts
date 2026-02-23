import { Request, Response } from 'express';
import { SubscriptionService } from '../services/SubscriptionService';

const subscriptionService = new SubscriptionService();

export class SubscriptionController {
  create = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id; 
      const subscriptionData = req.body;

      const subscription = await subscriptionService.create(userId, subscriptionData);
      return res.status(201).json(subscription);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  list = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const subscriptions = await subscriptionService.listAll(userId);
      return res.json(subscriptions);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const subscription = await subscriptionService.updateStatus(id, req.user.id, is_active);
    return res.json(subscription);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

  pay = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const subscription = await subscriptionService.pay(id, req.user.id);
      return res.json(subscription);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const data = req.body;

    const updatedSubscription = await subscriptionService.update(id, userId, data);
    return res.json(updatedSubscription);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user.id; // Obtido via authMiddleware

      const result = await subscriptionService.delete(id, userId);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
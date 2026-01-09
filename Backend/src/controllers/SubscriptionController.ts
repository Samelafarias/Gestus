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
}
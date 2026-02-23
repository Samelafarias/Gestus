import { Request, Response } from 'express';
import { ReportService } from '../services/ReportService';

const reportService = new ReportService();

export class ReportController {
  getSummary = async (req: Request, res: Response) => {
    try {
      const summary = await reportService.getSubscriptionSummary(req.user.id);
      return res.json(summary);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  getProjection = async (req: Request, res: Response) => {
    try {
      const projection = await reportService.getMonthlyProjection(req.user.id);
      return res.json(projection);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };
}
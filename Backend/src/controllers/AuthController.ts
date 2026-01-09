import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  // Use arrow functions aqui para evitar o erro de 'handler must be a function'
  signup = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const user = await authService.register(name, email, password);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  };

  sendRecovery = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const result = await authService.sendRecoveryToken(email);
        return res.json(result);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

  resetPassword = async (req: Request, res: Response) => {
      try {
          const { email, token, newPassword } = req.body;
          const result = await authService.resetPassword(email, token, newPassword);
          return res.json(result);
      } catch (error: any) {
          return res.status(400).json({ error: error.message });
      }
  };
}
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRouter = Router();
const authController = new AuthController();


authRouter.post('/signup', authController.signup); 
authRouter.post('/login', authController.login);
authRouter.post('/recovery', authController.sendRecovery);
authRouter.post('/reset-password', authController.resetPassword);

export default authRouter;
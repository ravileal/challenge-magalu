import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController';

interface IAuthRoutesOptions {
  authController: AuthController;
}

export async function authRoutes(app: FastifyInstance, options: IAuthRoutesOptions) {
  const { authController } = options;

  app.post('/auth/login', authController.login.bind(authController));
}

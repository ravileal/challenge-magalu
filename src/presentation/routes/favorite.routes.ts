import { FastifyInstance } from 'fastify';
import { authHook } from '../hooks/authHook';
import { FavoriteController } from '../controllers/FavoriteController';

interface IFavoriteRoutesOptions {
  favoriteController: FavoriteController;
}

export async function favoriteRoutes(app: FastifyInstance, options: IFavoriteRoutesOptions) {
  const { favoriteController } = options;

  app.addHook('onRequest', authHook);

  app.post('/favorites', favoriteController.add.bind(favoriteController));
  app.get('/favorites', favoriteController.list.bind(favoriteController));
}

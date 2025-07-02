import { FastifyRequest, FastifyReply } from 'fastify';
import { AddFavoriteUseCase } from '../../application/use-cases/AddFavoriteUseCase';
import { ListFavoritesUseCase } from '../../application/use-cases/ListFavoritesUseCase';
import { addFavoriteSchema } from '../schemas';

export class FavoriteController {
  constructor(
    private addFavoriteUseCase: AddFavoriteUseCase,
    private listFavoritesUseCase: ListFavoritesUseCase,
  ) {}

  async add(request: FastifyRequest, reply: FastifyReply) {
    const { clientId } = request.user;
    const { productId } = addFavoriteSchema.parse(request.body);
    await this.addFavoriteUseCase.execute(clientId, productId);
    return reply.status(204).send();
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { clientId } = request.user;
    const favorites = await this.listFavoritesUseCase.execute(clientId);
    return reply.send(favorites);
  }
}

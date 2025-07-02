import { Knex } from 'knex';
import { IFavoriteRepository } from '../../../application/repositories/IFavoriteRepository';

export class PostgresFavoriteRepository implements IFavoriteRepository {
  constructor(private connection: Knex) {}

  async add(clientId: string, productId: string): Promise<void> {
    await this.connection('favorite_products').insert({
      client_id: clientId,
      product_id: productId,
    });
  }

  async findByClientId(clientId: string): Promise<{ product_id: string }[]> {
    const favorites = await this.connection('favorite_products').where({ client_id: clientId }).select('product_id');
    return favorites;
  }
}

export interface IFavoriteRepository {
  add(clientId: string, productId: string): Promise<void>;
  findByClientId(clientId: string): Promise<{ product_id: string }[]>;
}

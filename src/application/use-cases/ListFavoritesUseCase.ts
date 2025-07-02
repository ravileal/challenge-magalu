import { Product } from '../../domain/product.entity';
import { IFavoriteRepository } from '../repositories/IFavoriteRepository';
import { IProductApiService } from '../services/IProductApiService';
import { ICacheService } from '../services/ICacheService';

export class ListFavoritesUseCase {
  constructor(
    private favoriteRepository: IFavoriteRepository,
    private productApiService: IProductApiService,
    private cacheService: ICacheService,
  ) {}

  async execute(clientId: string): Promise<Product[]> {
    const cacheKey = `favorites:${clientId}`;

    const cachedFavorites = await this.cacheService.get<Product[]>(cacheKey);
    if (cachedFavorites) {
      return cachedFavorites;
    }

    const favoriteIds = await this.favoriteRepository.findByClientId(clientId);
    const productPromises = favoriteIds.map((fav) => this.productApiService.findProductById(fav.product_id));
    const products = (await Promise.all(productPromises)).filter((p): p is Product => p !== null);

    const TTL_IN_SECONDS = 600;
    await this.cacheService.set(cacheKey, products, TTL_IN_SECONDS);

    return products;
  }
}

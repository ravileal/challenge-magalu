import { Product } from '../../domain/product.entity';

export interface IProductApiService {
  findProductById(id: string): Promise<Product | null>;
}

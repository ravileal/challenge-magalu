import { IProductApiService } from '../../application/services/IProductApiService';
import { Product } from '../../domain/product.entity';

export class FakeStoreApiAdapter implements IProductApiService {
  private readonly baseUrl = 'https://fakestoreapi.com';

  async findProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`);
      if (!response.ok) {
        return null;
      }
      const product: Product = (await response.json()) as Product;
      return product;
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        console.error('Error fetching product from FakeStoreAPI:', error);
      }
      return null;
    }
  }
}

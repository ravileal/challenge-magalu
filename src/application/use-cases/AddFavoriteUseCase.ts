import { ZodError, ZodIssueCode } from 'zod';

import { IClientRepository } from '../repositories/IClientRepository';
import { IFavoriteRepository } from '../repositories/IFavoriteRepository';
import { IProductApiService } from '../services/IProductApiService';
import { ICacheService } from '../services/ICacheService';

export class AddFavoriteUseCase {
  constructor(
    private clientRepository: IClientRepository,
    private productApiService: IProductApiService,
    private favoriteRepository: IFavoriteRepository,
    private cacheService: ICacheService,
  ) {}

  async execute(clientId: string, productId: string): Promise<void> {
    const client = await this.clientRepository.findById(clientId);
    if (!client)
      throw new ZodError([
        {
          code: ZodIssueCode.custom,
          path: ['clientId'],
          message: 'Client not found.',
        },
      ]);

    const product = await this.productApiService.findProductById(productId);
    if (!product)
      throw new ZodError([
        {
          code: ZodIssueCode.custom,
          path: ['productId'],
          message: 'Product not found.',
        },
      ]);

    try {
      await this.favoriteRepository.add(clientId, productId);
      await this.cacheService.invalidate(`favorites:${clientId}`);
    } catch (error: unknown) {
      const UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE = '23505';
      if (error instanceof Error && 'code' in error && error.code === UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE) {
        throw new ZodError([
          {
            code: ZodIssueCode.custom,
            path: ['productId'],
            message: 'Product already in favorites.',
          },
        ]);
      }
      throw error;
    }
  }
}

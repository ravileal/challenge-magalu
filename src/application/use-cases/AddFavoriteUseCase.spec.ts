import { AddFavoriteUseCase } from './AddFavoriteUseCase';
import { IClientRepository } from '../repositories/IClientRepository';
import { IFavoriteRepository } from '../repositories/IFavoriteRepository';
import { IProductApiService } from '../services/IProductApiService';
import { ICacheService } from '../services/ICacheService';
import { makeFakeClient } from '../../../tests/factories/make-fake-client';
import { makeFakeProduct } from '../../../tests/factories/make-fake-product';

const mockClientRepo: IClientRepository = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
const mockFavoriteRepo: IFavoriteRepository = {
  add: jest.fn(),
  findByClientId: jest.fn(),
};
const mockProductApi: IProductApiService = {
  findProductById: jest.fn(),
};
const mockCache: ICacheService = {
  get: jest.fn(),
  set: jest.fn(),
  invalidate: jest.fn(),
};
const UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE = '23505';

describe('Add Favorite Use Case', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should add a favorite product and invalidate cache', async () => {
    const useCase = new AddFavoriteUseCase(mockClientRepo, mockProductApi, mockFavoriteRepo, mockCache);

    const fakeClient = makeFakeClient();
    const fakeProduct = makeFakeProduct();

    jest.mocked(mockClientRepo.findById).mockResolvedValue(fakeClient);
    jest.mocked(mockProductApi.findProductById).mockResolvedValue(fakeProduct);

    jest.mocked(mockFavoriteRepo.add).mockResolvedValue(undefined);

    await useCase.execute(fakeClient.id, fakeProduct.id);

    expect(mockProductApi.findProductById).toHaveBeenCalledWith(fakeProduct.id);
    expect(mockFavoriteRepo.add).toHaveBeenCalledWith(fakeClient.id, fakeProduct.id);
    expect(mockCache.invalidate).toHaveBeenCalledWith(`favorites:${fakeClient.id}`);
  });

  it('should throw an error if product does not exist', async () => {
    const useCase = new AddFavoriteUseCase(mockClientRepo, mockProductApi, mockFavoriteRepo, mockCache);

    const fakeClient = makeFakeClient();

    jest.mocked(mockClientRepo.findById).mockResolvedValue(fakeClient);
    jest.mocked(mockProductApi.findProductById).mockResolvedValue(null);

    await expect(useCase.execute(fakeClient.id, 'p-non-existent')).rejects.toThrow('Product not found.');
  });

  it('should throw a specific error if product is already a favorite', async () => {
    const useCase = new AddFavoriteUseCase(mockClientRepo, mockProductApi, mockFavoriteRepo, mockCache);

    const fakeClient = makeFakeClient();
    const fakeProduct = makeFakeProduct();

    jest.mocked(mockClientRepo.findById).mockResolvedValue(fakeClient);
    jest.mocked(mockProductApi.findProductById).mockResolvedValue(fakeProduct);

    jest
      .mocked(mockFavoriteRepo.add)
      .mockRejectedValue(Object.assign(new Error(), { code: UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE }));

    await expect(useCase.execute(fakeClient.id, fakeProduct.id)).rejects.toThrow('Product already in favorites.');
  });
});

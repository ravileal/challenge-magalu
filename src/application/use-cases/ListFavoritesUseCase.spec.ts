import { ListFavoritesUseCase } from './ListFavoritesUseCase';
import { IFavoriteRepository } from '../repositories/IFavoriteRepository';
import { IProductApiService } from '../services/IProductApiService';
import { ICacheService } from '../services/ICacheService';
import { makeFakeClient } from '../../../tests/factories/make-fake-client';
import { makeFakeProduct } from '../../../tests/factories/make-fake-product';

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

describe('List Favorites Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return cached favorites if available', async () => {
    const useCase = new ListFavoritesUseCase(mockFavoriteRepo, mockProductApi, mockCache);
    const fakeClient = makeFakeClient();
    const fakeCachedProducts = [makeFakeProduct()];

    jest.mocked(mockCache.get).mockResolvedValue(fakeCachedProducts);

    const result = await useCase.execute(fakeClient.id);

    expect(result).toEqual(fakeCachedProducts);
    expect(mockCache.get).toHaveBeenCalledWith(`favorites:${fakeClient.id}`);
    expect(mockFavoriteRepo.findByClientId).not.toHaveBeenCalled();
  });

  it('should fetch from repository and API if cache is empty, then set cache', async () => {
    const useCase = new ListFavoritesUseCase(mockFavoriteRepo, mockProductApi, mockCache);
    const fakeClient = makeFakeClient();
    const fakeProduct1 = makeFakeProduct({ id: 'product-101' });
    const fakeProduct2 = makeFakeProduct({ id: 'product-102' });

    jest.mocked(mockCache.get).mockResolvedValue(null);
    jest
      .mocked(mockFavoriteRepo.findByClientId)
      .mockResolvedValue([{ product_id: String(fakeProduct1.id) }, { product_id: String(fakeProduct2.id) }]);
    jest.mocked(mockProductApi.findProductById).mockResolvedValueOnce(fakeProduct1).mockResolvedValueOnce(fakeProduct2);

    const result = await useCase.execute(fakeClient.id);

    expect(result).toEqual([fakeProduct1, fakeProduct2]);
    expect(mockFavoriteRepo.findByClientId).toHaveBeenCalledWith(fakeClient.id);
    expect(mockProductApi.findProductById).toHaveBeenCalledTimes(2);
    expect(mockCache.set).toHaveBeenCalledWith(`favorites:${fakeClient.id}`, [fakeProduct1, fakeProduct2], 600);
  });

  it('should return empty array when client has no favorites', async () => {
    const useCase = new ListFavoritesUseCase(mockFavoriteRepo, mockProductApi, mockCache);
    const fakeClient = makeFakeClient();

    jest.mocked(mockCache.get).mockResolvedValue(null);
    jest.mocked(mockFavoriteRepo.findByClientId).mockResolvedValue([]);

    const result = await useCase.execute(fakeClient.id);

    expect(result).toEqual([]);
    expect(mockFavoriteRepo.findByClientId).toHaveBeenCalledWith(fakeClient.id);
    expect(mockProductApi.findProductById).not.toHaveBeenCalled();
    expect(mockCache.set).toHaveBeenCalledWith(`favorites:${fakeClient.id}`, [], 600);
  });

  it('should filter out null products from API response', async () => {
    const useCase = new ListFavoritesUseCase(mockFavoriteRepo, mockProductApi, mockCache);
    const fakeClient = makeFakeClient();
    const fakeProduct1 = makeFakeProduct({ id: 'product-101' });
    const fakeProduct2 = makeFakeProduct({ id: 'product-102' });

    jest.mocked(mockCache.get).mockResolvedValue(null);
    jest
      .mocked(mockFavoriteRepo.findByClientId)
      .mockResolvedValue([
        { product_id: String(fakeProduct1.id) },
        { product_id: '999' },
        { product_id: String(fakeProduct2.id) },
      ]);
    jest
      .mocked(mockProductApi.findProductById)
      .mockResolvedValueOnce(fakeProduct1)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(fakeProduct2);

    const result = await useCase.execute(fakeClient.id);

    expect(result).toEqual([fakeProduct1, fakeProduct2]);
    expect(mockProductApi.findProductById).toHaveBeenCalledTimes(3);
    expect(mockCache.set).toHaveBeenCalledWith(`favorites:${fakeClient.id}`, [fakeProduct1, fakeProduct2], 600);
  });

  it('should handle API errors gracefully', async () => {
    const useCase = new ListFavoritesUseCase(mockFavoriteRepo, mockProductApi, mockCache);
    const fakeClient = makeFakeClient();

    jest.mocked(mockCache.get).mockResolvedValue(null);
    jest.mocked(mockFavoriteRepo.findByClientId).mockResolvedValue([{ product_id: '1' }]);
    jest.mocked(mockProductApi.findProductById).mockRejectedValue(new Error('API Error'));

    await expect(useCase.execute(fakeClient.id)).rejects.toThrow('API Error');
    expect(mockCache.set).not.toHaveBeenCalled();
  });

  it('should handle repository errors gracefully', async () => {
    const useCase = new ListFavoritesUseCase(mockFavoriteRepo, mockProductApi, mockCache);
    const fakeClient = makeFakeClient();

    jest.mocked(mockCache.get).mockResolvedValue(null);
    jest.mocked(mockFavoriteRepo.findByClientId).mockRejectedValue(new Error('Database Error'));

    await expect(useCase.execute(fakeClient.id)).rejects.toThrow('Database Error');
    expect(mockProductApi.findProductById).not.toHaveBeenCalled();
    expect(mockCache.set).not.toHaveBeenCalled();
  });

  it('should handle cache errors gracefully', async () => {
    const useCase = new ListFavoritesUseCase(mockFavoriteRepo, mockProductApi, mockCache);
    const fakeClient = makeFakeClient();

    jest.mocked(mockCache.get).mockRejectedValue(new Error('Cache Error'));

    await expect(useCase.execute(fakeClient.id)).rejects.toThrow('Cache Error');
  });
});

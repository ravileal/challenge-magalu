"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ListFavoritesUseCase_1 = require("./ListFavoritesUseCase");
const make_fake_client_1 = require("../../../tests/factories/make-fake-client");
const make_fake_product_1 = require("../../../tests/factories/make-fake-product");
const mockFavoriteRepo = {
    add: jest.fn(),
    findByClientId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};
const mockProductApi = {
    findProductById: jest.fn(),
};
const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
    invalidate: jest.fn(),
};
describe('List Favorites Use Case', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should return cached favorites if available', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new ListFavoritesUseCase_1.ListFavoritesUseCase(mockFavoriteRepo, mockProductApi, mockCache);
        const fakeClient = (0, make_fake_client_1.makeFakeClient)();
        const fakeCachedProducts = [(0, make_fake_product_1.makeFakeProduct)()];
        jest.mocked(mockCache.get).mockResolvedValue(fakeCachedProducts);
        const result = yield useCase.execute(fakeClient.id);
        expect(result).toEqual(fakeCachedProducts);
        expect(mockCache.get).toHaveBeenCalledWith(`favorites:${fakeClient.id}`);
        expect(mockFavoriteRepo.findByClientId).not.toHaveBeenCalled();
    }));
    it('should fetch from repository and API if cache is empty, then set cache', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new ListFavoritesUseCase_1.ListFavoritesUseCase(mockFavoriteRepo, mockProductApi, mockCache);
        const fakeClient = (0, make_fake_client_1.makeFakeClient)();
        const fakeProduct1 = (0, make_fake_product_1.makeFakeProduct)({ id: 'product-101' });
        const fakeProduct2 = (0, make_fake_product_1.makeFakeProduct)({ id: 'product-102' });
        jest.mocked(mockCache.get).mockResolvedValue(null);
        jest
            .mocked(mockFavoriteRepo.findByClientId)
            .mockResolvedValue([{ product_id: String(fakeProduct1.id) }, { product_id: String(fakeProduct2.id) }]);
        jest.mocked(mockProductApi.findProductById).mockResolvedValueOnce(fakeProduct1).mockResolvedValueOnce(fakeProduct2);
        const result = yield useCase.execute(fakeClient.id);
        expect(result).toEqual([fakeProduct1, fakeProduct2]);
        expect(mockFavoriteRepo.findByClientId).toHaveBeenCalledWith(fakeClient.id);
        expect(mockProductApi.findProductById).toHaveBeenCalledTimes(2);
        expect(mockCache.set).toHaveBeenCalledWith(`favorites:${fakeClient.id}`, [fakeProduct1, fakeProduct2], 600);
    }));
    it('should return empty array when client has no favorites', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new ListFavoritesUseCase_1.ListFavoritesUseCase(mockFavoriteRepo, mockProductApi, mockCache);
        const fakeClient = (0, make_fake_client_1.makeFakeClient)();
        jest.mocked(mockCache.get).mockResolvedValue(null);
        jest.mocked(mockFavoriteRepo.findByClientId).mockResolvedValue([]);
        const result = yield useCase.execute(fakeClient.id);
        expect(result).toEqual([]);
        expect(mockFavoriteRepo.findByClientId).toHaveBeenCalledWith(fakeClient.id);
        expect(mockProductApi.findProductById).not.toHaveBeenCalled();
        expect(mockCache.set).toHaveBeenCalledWith(`favorites:${fakeClient.id}`, [], 600);
    }));
    it('should filter out null products from API response', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new ListFavoritesUseCase_1.ListFavoritesUseCase(mockFavoriteRepo, mockProductApi, mockCache);
        const fakeClient = (0, make_fake_client_1.makeFakeClient)();
        const fakeProduct1 = (0, make_fake_product_1.makeFakeProduct)({ id: 'product-101' });
        const fakeProduct2 = (0, make_fake_product_1.makeFakeProduct)({ id: 'product-102' });
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
        const result = yield useCase.execute(fakeClient.id);
        expect(result).toEqual([fakeProduct1, fakeProduct2]);
        expect(mockProductApi.findProductById).toHaveBeenCalledTimes(3);
        expect(mockCache.set).toHaveBeenCalledWith(`favorites:${fakeClient.id}`, [fakeProduct1, fakeProduct2], 600);
    }));
    it('should handle API errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new ListFavoritesUseCase_1.ListFavoritesUseCase(mockFavoriteRepo, mockProductApi, mockCache);
        const fakeClient = (0, make_fake_client_1.makeFakeClient)();
        jest.mocked(mockCache.get).mockResolvedValue(null);
        jest.mocked(mockFavoriteRepo.findByClientId).mockResolvedValue([{ product_id: '1' }]);
        jest.mocked(mockProductApi.findProductById).mockRejectedValue(new Error('API Error'));
        yield expect(useCase.execute(fakeClient.id)).rejects.toThrow('API Error');
        expect(mockCache.set).not.toHaveBeenCalled();
    }));
    it('should handle repository errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new ListFavoritesUseCase_1.ListFavoritesUseCase(mockFavoriteRepo, mockProductApi, mockCache);
        const fakeClient = (0, make_fake_client_1.makeFakeClient)();
        jest.mocked(mockCache.get).mockResolvedValue(null);
        jest.mocked(mockFavoriteRepo.findByClientId).mockRejectedValue(new Error('Database Error'));
        yield expect(useCase.execute(fakeClient.id)).rejects.toThrow('Database Error');
        expect(mockProductApi.findProductById).not.toHaveBeenCalled();
        expect(mockCache.set).not.toHaveBeenCalled();
    }));
    it('should handle cache errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new ListFavoritesUseCase_1.ListFavoritesUseCase(mockFavoriteRepo, mockProductApi, mockCache);
        const fakeClient = (0, make_fake_client_1.makeFakeClient)();
        jest.mocked(mockCache.get).mockRejectedValue(new Error('Cache Error'));
        yield expect(useCase.execute(fakeClient.id)).rejects.toThrow('Cache Error');
    }));
});

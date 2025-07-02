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
const AddFavoriteUseCase_1 = require("./AddFavoriteUseCase");
const make_fake_client_1 = require("../../../tests/factories/make-fake-client");
const make_fake_product_1 = require("../../../tests/factories/make-fake-product");
const mockClientRepo = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};
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
const UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE = '23505';
describe('Add Favorite Use Case', () => {
    beforeEach(() => jest.clearAllMocks());
    it('should add a favorite product and invalidate cache', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new AddFavoriteUseCase_1.AddFavoriteUseCase(mockClientRepo, mockProductApi, mockFavoriteRepo, mockCache);
        const fakeClient = (0, make_fake_client_1.makeFakeClient)();
        const fakeProduct = (0, make_fake_product_1.makeFakeProduct)();
        jest.mocked(mockClientRepo.findById).mockResolvedValue(fakeClient);
        jest.mocked(mockProductApi.findProductById).mockResolvedValue(fakeProduct);
        jest.mocked(mockFavoriteRepo.add).mockResolvedValue(undefined);
        yield useCase.execute(fakeClient.id, fakeProduct.id);
        expect(mockProductApi.findProductById).toHaveBeenCalledWith(fakeProduct.id);
        expect(mockFavoriteRepo.add).toHaveBeenCalledWith(fakeClient.id, fakeProduct.id);
        expect(mockCache.invalidate).toHaveBeenCalledWith(`favorites:${fakeClient.id}`);
    }));
    it('should throw an error if product does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new AddFavoriteUseCase_1.AddFavoriteUseCase(mockClientRepo, mockProductApi, mockFavoriteRepo, mockCache);
        const fakeClient = (0, make_fake_client_1.makeFakeClient)();
        jest.mocked(mockClientRepo.findById).mockResolvedValue(fakeClient);
        jest.mocked(mockProductApi.findProductById).mockResolvedValue(null);
        yield expect(useCase.execute(fakeClient.id, 'p-non-existent')).rejects.toThrow('Product not found.');
    }));
    it('should throw a specific error if product is already a favorite', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new AddFavoriteUseCase_1.AddFavoriteUseCase(mockClientRepo, mockProductApi, mockFavoriteRepo, mockCache);
        const fakeClient = (0, make_fake_client_1.makeFakeClient)();
        const fakeProduct = (0, make_fake_product_1.makeFakeProduct)();
        jest.mocked(mockClientRepo.findById).mockResolvedValue(fakeClient);
        jest.mocked(mockProductApi.findProductById).mockResolvedValue(fakeProduct);
        jest.mocked(mockFavoriteRepo.add).mockRejectedValue({
            code: UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE,
        });
        yield expect(useCase.execute(fakeClient.id, fakeProduct.id)).rejects.toThrow('Product already in favorites.');
    }));
});

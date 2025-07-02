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
exports.AddFavoriteUseCase = void 0;
class AddFavoriteUseCase {
    constructor(clientRepository, productApiService, favoriteRepository, cacheService) {
        this.clientRepository = clientRepository;
        this.productApiService = productApiService;
        this.favoriteRepository = favoriteRepository;
        this.cacheService = cacheService;
    }
    execute(clientId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.clientRepository.findById(clientId);
            if (!client)
                throw new Error('Client not found.');
            const product = yield this.productApiService.findProductById(productId);
            if (!product) {
                throw new Error('Product not found.');
            }
            try {
                yield this.favoriteRepository.add(clientId, productId);
                yield this.cacheService.invalidate(`favorites:${clientId}`);
                yield this.favoriteRepository.add(clientId, productId);
            }
            catch (error) {
                const UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE = '23505';
                if (typeof error === 'object' &&
                    error !== null &&
                    'code' in error &&
                    error.code === UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE) {
                    throw new Error('Product already in favorites.');
                }
                throw error;
            }
        });
    }
}
exports.AddFavoriteUseCase = AddFavoriteUseCase;

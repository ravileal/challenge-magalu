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
exports.ListFavoritesUseCase = void 0;
class ListFavoritesUseCase {
    constructor(favoriteRepository, productApiService, cacheService) {
        this.favoriteRepository = favoriteRepository;
        this.productApiService = productApiService;
        this.cacheService = cacheService;
    }
    execute(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `favorites:${clientId}`;
            const cachedFavorites = yield this.cacheService.get(cacheKey);
            if (cachedFavorites) {
                return cachedFavorites;
            }
            const favoriteIds = yield this.favoriteRepository.findByClientId(clientId);
            const productPromises = favoriteIds.map((fav) => this.productApiService.findProductById(fav.product_id));
            const products = (yield Promise.all(productPromises)).filter((p) => p !== null);
            yield this.cacheService.set(cacheKey, products, 600);
            return products;
        });
    }
}
exports.ListFavoritesUseCase = ListFavoritesUseCase;

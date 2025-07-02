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
exports.FakeStoreApiAdapter = void 0;
class FakeStoreApiAdapter {
    constructor() {
        this.baseUrl = 'https://fakestoreapi.com';
    }
    findProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.baseUrl}/products/${id}`);
                if (!response.ok) {
                    return null;
                }
                const product = (yield response.json());
                return product;
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error fetching product from FakeStoreAPI:', error);
                }
                return null;
            }
        });
    }
}
exports.FakeStoreApiAdapter = FakeStoreApiAdapter;

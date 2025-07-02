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
exports.PostgresFavoriteRepository = void 0;
const knex_1 = require("../knex");
class PostgresFavoriteRepository {
    add(clientId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, knex_1.connection)('favorite_products').insert({
                client_id: clientId,
                product_id: productId,
            });
        });
    }
    findByClientId(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const favorites = yield (0, knex_1.connection)('favorite_products').where({ client_id: clientId }).select('product_id');
            return favorites;
        });
    }
    update(clientId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
    remove(clientId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
}
exports.PostgresFavoriteRepository = PostgresFavoriteRepository;

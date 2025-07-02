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
exports.FavoriteController = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../schemas");
class FavoriteController {
    constructor(addFavoriteUseCase, listFavoritesUseCase) {
        this.addFavoriteUseCase = addFavoriteUseCase;
        this.listFavoritesUseCase = listFavoritesUseCase;
    }
    add(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientId } = request.user;
                const { productId } = schemas_1.addFavoriteSchema.parse(request.body);
                yield this.addFavoriteUseCase.execute(clientId, productId);
                return reply.status(204).send();
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return reply.status(400).send({
                        message: 'Invalid input data',
                        errors: error.flatten().fieldErrors,
                    });
                }
                if (error instanceof Error) {
                    console.error({ message: error === null || error === void 0 ? void 0 : error.message });
                }
                return reply.status(500).send({ message: 'Internal Server Error' });
            }
        });
    }
    list(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clientId } = request.user;
            const favorites = yield this.listFavoritesUseCase.execute(clientId);
            return reply.send(favorites);
        });
    }
}
exports.FavoriteController = FavoriteController;

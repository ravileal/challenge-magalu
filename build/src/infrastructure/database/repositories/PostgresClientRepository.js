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
exports.PostgresClientRepository = void 0;
const knex_1 = require("../knex");
class PostgresClientRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [client] = yield (0, knex_1.connection)('clients').insert(data).returning('*');
            return client;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield (0, knex_1.connection)('clients').where({ email }).first();
            return client || null;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield (0, knex_1.connection)('clients').where({ id }).first();
            return client || null;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedClient] = yield (0, knex_1.connection)('clients')
                .where({ id })
                .update(data)
                .returning('*');
            return updatedClient || null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, knex_1.connection)('clients').where({ id }).del();
        });
    }
}
exports.PostgresClientRepository = PostgresClientRepository;

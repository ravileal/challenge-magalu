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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheAdapter = void 0;
const client_1 = __importDefault(require("../database/redis/client"));
class RedisCacheAdapter {
    constructor() {
        this.client = client_1.default;
    }
    getClient() {
        if (!this.client.isOpen) {
            throw new Error('Redis client is not connected.');
        }
        return this.client;
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getClient().get(key);
            return data ? JSON.parse(data) : null;
        });
    }
    set(key, value, ttlInSeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getClient().set(key, JSON.stringify(value), { EX: ttlInSeconds });
        });
    }
    invalidate(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getClient().del(key);
        });
    }
}
exports.RedisCacheAdapter = RedisCacheAdapter;

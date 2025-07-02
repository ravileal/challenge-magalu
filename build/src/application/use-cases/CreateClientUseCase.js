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
exports.CreateClientUseCase = void 0;
class CreateClientUseCase {
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email }) {
            const clientAlreadyExists = yield this.clientRepository.findByEmail(email);
            if (clientAlreadyExists) {
                throw new Error('Client with this email already exists.');
            }
            const client = yield this.clientRepository.create({ name, email });
            return client;
        });
    }
}
exports.CreateClientUseCase = CreateClientUseCase;

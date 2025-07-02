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
exports.UpdateClientUseCase = void 0;
class UpdateClientUseCase {
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    execute(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientExists = yield this.clientRepository.findById(id);
            if (!clientExists) {
                throw new Error('Client not found.');
            }
            if (data.email && data.email !== clientExists.email) {
                const emailInUse = yield this.clientRepository.findByEmail(data.email);
                if (emailInUse) {
                    throw new Error('Email already in use by another client.');
                }
            }
            const updatedClient = yield this.clientRepository.update(id, data);
            return updatedClient;
        });
    }
}
exports.UpdateClientUseCase = UpdateClientUseCase;

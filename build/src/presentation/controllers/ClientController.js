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
exports.ClientController = void 0;
const schemas_1 = require("../schemas");
class ClientController {
    constructor(createClientUseCase, getClientUseCase, updateClientUseCase, deleteClientUseCase) {
        this.createClientUseCase = createClientUseCase;
        this.getClientUseCase = getClientUseCase;
        this.updateClientUseCase = updateClientUseCase;
        this.deleteClientUseCase = deleteClientUseCase;
    }
    create(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email } = schemas_1.createClientSchema.parse(request.body);
                const client = yield this.createClientUseCase.execute({ name, email });
                return reply.status(201).send(client);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error({ message: error === null || error === void 0 ? void 0 : error.message });
                }
                return reply.status(500).send({ message: 'Internal Server Error' });
            }
        });
    }
    findById(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = schemas_1.clientParamsSchema.parse(request.params);
                const client = yield this.getClientUseCase.execute(id);
                return reply.send(client);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error({ message: error === null || error === void 0 ? void 0 : error.message });
                }
                return reply.status(500).send({ message: 'Internal Server Error' });
            }
        });
    }
    update(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = schemas_1.clientParamsSchema.parse(request.params);
                const data = schemas_1.updateClientSchema.parse(request.body);
                const updatedClient = yield this.updateClientUseCase.execute(id, data);
                return reply.send(updatedClient);
            }
            catch (error) {
                if (error instanceof Error) {
                    const statusCode = error.message.includes('not found') ? 404 : 400;
                    console.error({ message: error === null || error === void 0 ? void 0 : error.message });
                    return reply.status(statusCode).send();
                }
                return reply.status(500).send({ message: 'Internal Server Error' });
            }
        });
    }
    delete(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = schemas_1.clientParamsSchema.parse(request.params);
                yield this.deleteClientUseCase.execute(id);
                return reply.status(204).send();
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error({ message: error === null || error === void 0 ? void 0 : error.message });
                }
                return reply.status(500).send({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.ClientController = ClientController;

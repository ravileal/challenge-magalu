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
exports.AuthController = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../schemas");
class AuthController {
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    login(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const app = reply.server;
                const { email } = schemas_1.loginSchema.parse(request.body);
                const client = yield this.clientRepository.findByEmail(email);
                if (!client) {
                    return reply.status(401).send({ message: 'Invalid credentials' });
                }
                const token = app.jwt.sign({ clientId: client.id });
                return reply.send({ token });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return reply.status(400).send({
                        message: 'Invalid input data',
                        errors: error.flatten().fieldErrors,
                    });
                }
                return reply.status(500).send({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.AuthController = AuthController;

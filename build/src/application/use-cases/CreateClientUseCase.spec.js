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
const make_fake_client_1 = require("../../../tests/factories/make-fake-client");
const CreateClientUseCase_1 = require("./CreateClientUseCase");
const mockClientRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};
describe('Create Client Use Case', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should be able to create a new client', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new CreateClientUseCase_1.CreateClientUseCase(mockClientRepository);
        const fakeClient = (0, make_fake_client_1.makeFakeClient)();
        jest.mocked(mockClientRepository.findByEmail).mockResolvedValue(null);
        jest.mocked(mockClientRepository.create).mockResolvedValue(fakeClient);
        const client = yield useCase.execute({ name: fakeClient.name, email: fakeClient.email });
        expect(client).toHaveProperty('id');
        expect(client.name).toBe(fakeClient.name);
        expect(mockClientRepository.findByEmail).toHaveBeenCalledWith(fakeClient.email);
        expect(mockClientRepository.create).toHaveBeenCalledWith({ name: fakeClient.name, email: fakeClient.email });
    }));
    it('should not be able to create a client with an existing email', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new CreateClientUseCase_1.CreateClientUseCase(mockClientRepository);
        const fakeClient = (0, make_fake_client_1.makeFakeClient)();
        jest.mocked(mockClientRepository.findByEmail).mockResolvedValue(fakeClient);
        yield expect(useCase.execute({ name: fakeClient.name, email: fakeClient.email })).rejects.toThrow('Client with this email already exists.');
        expect(mockClientRepository.create).not.toHaveBeenCalled();
    }));
});

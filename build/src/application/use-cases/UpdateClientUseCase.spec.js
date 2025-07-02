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
const UpdateClientUseCase_1 = require("./UpdateClientUseCase");
const mockClientRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};
describe('Update Client Use Case', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should be able to update a client', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new UpdateClientUseCase_1.UpdateClientUseCase(mockClientRepository);
        const fakeClient = (0, make_fake_client_1.makeFakeClient)();
        const updatedData = { name: 'John Doe Updated' };
        jest.mocked(mockClientRepository.findById).mockResolvedValue(fakeClient);
        jest.mocked(mockClientRepository.update).mockResolvedValue(Object.assign(Object.assign({}, fakeClient), updatedData));
        const updatedClient = yield useCase.execute(fakeClient.id, updatedData);
        expect(updatedClient.name).toBe(updatedData.name);
        expect(mockClientRepository.update).toHaveBeenCalledWith(fakeClient.id, updatedData);
    }));
    it('should throw an error if client to update is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new UpdateClientUseCase_1.UpdateClientUseCase(mockClientRepository);
        jest.mocked(mockClientRepository.findById).mockResolvedValue(null);
        yield expect(useCase.execute('non-existent-id', { name: 'test' })).rejects.toThrow('Client not found.');
    }));
    it('should throw an error if new email is already in use by another client', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new UpdateClientUseCase_1.UpdateClientUseCase(mockClientRepository);
        const existingClient = (0, make_fake_client_1.makeFakeClient)({ id: 'uuid-123', name: 'John Doe', email: 'john@doe.com' });
        const otherClientWithEmail = (0, make_fake_client_1.makeFakeClient)({ id: 'uuid-456', name: 'Jane Doe', email: 'jane@doe.com' });
        jest.mocked(mockClientRepository.findById).mockResolvedValue(existingClient);
        jest.mocked(mockClientRepository.findByEmail).mockResolvedValue(otherClientWithEmail);
        yield expect(useCase.execute(existingClient.id, { email: 'jane@doe.com' })).rejects.toThrow('Email already in use by another client.');
    }));
});

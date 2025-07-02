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
const DeleteClientUseCase_1 = require("./DeleteClientUseCase");
const mockClientRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};
describe('Delete Client Use Case', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should be able to delete a client', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new DeleteClientUseCase_1.DeleteClientUseCase(mockClientRepository);
        const fakeClient = (0, make_fake_client_1.makeFakeClient)();
        jest.mocked(mockClientRepository.findById).mockResolvedValue(fakeClient);
        jest.mocked(mockClientRepository.delete).mockResolvedValue(undefined);
        yield useCase.execute(fakeClient.id);
        expect(mockClientRepository.delete).toHaveBeenCalledWith(fakeClient.id);
    }));
    it('should throw an error if client to delete is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const useCase = new DeleteClientUseCase_1.DeleteClientUseCase(mockClientRepository);
        jest.mocked(mockClientRepository.findById).mockResolvedValue(null);
        yield expect(useCase.execute('non-existent-id')).rejects.toThrow('Client not found.');
    }));
});

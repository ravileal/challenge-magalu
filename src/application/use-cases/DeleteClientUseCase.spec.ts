import { makeFakeClient } from '../../../tests/factories/make-fake-client';
import { IClientRepository } from '../repositories/IClientRepository';
import { DeleteClientUseCase } from './DeleteClientUseCase';

const mockClientRepository: IClientRepository = {
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

  it('should be able to delete a client', async () => {
    const useCase = new DeleteClientUseCase(mockClientRepository);

    const fakeClient = makeFakeClient();

    jest.mocked(mockClientRepository.findById).mockResolvedValue(fakeClient);
    jest.mocked(mockClientRepository.delete).mockResolvedValue(undefined);

    await useCase.execute(fakeClient.id);

    expect(mockClientRepository.delete).toHaveBeenCalledWith(fakeClient.id);
  });

  it('should throw an error if client to delete is not found', async () => {
    const useCase = new DeleteClientUseCase(mockClientRepository);
    jest.mocked(mockClientRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute('non-existent-id')).rejects.toThrow('Client not found.');
  });
});

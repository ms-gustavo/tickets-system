export const mockUserRepository = {
  findByEmail: jest.fn(),
  createUser: jest.fn(),
};

export const mockUserTempRepository = {
  findByEmail: jest.fn(),
  findByConfirmId: jest.fn(),
  createUserTemp: jest.fn(),
  deleteUserTemp: jest.fn(),
};

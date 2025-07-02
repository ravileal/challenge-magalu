module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  clearMocks: true,
  collectCoverageFrom: [
    'src/application/use-cases/**/*.ts',
    'src/application/services/**/*.ts',
  ],
};

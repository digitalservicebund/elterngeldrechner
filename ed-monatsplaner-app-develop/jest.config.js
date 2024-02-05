module.exports = {
  preset: 'ts-jest',
  roots: ['src'],
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  testPathIgnorePatterns: ['node_modules/', 'build/'],
  transform: {
    '^.+.ts$': 'ts-jest',
  },
  testMatch: ['**/*.spec.(ts|tsx)']
};

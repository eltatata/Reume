import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coveragePathIgnorePatterns: ['/node_modules/', '/generated/', '/dist/'],
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/set-up-test.ts'],
  testEnvironment: 'jest-environment-node',
};

export default config;

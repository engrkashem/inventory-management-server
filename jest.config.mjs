import { createRequire } from 'module';
import { pathsToModuleNameMapper } from 'ts-jest';
const require = createRequire(import.meta.url);
const { compilerOptions } = require('./tsconfig.json');

/** @type {import('ts-jest').InitialOptionsTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};

export default config;

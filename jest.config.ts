/** @type {import('ts-jest').JestConfigWithTsJest} */
// require('ts-node').register({ transpileOnly: true });

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.spec.ts',
    '!**/*d.ts',
    '!**/*.config.(t|j)s',
    '!**/index.ts',
  ],
  coveragePathIgnorePatterns: ['node_modules', 'dist'],
  testRegex: '.spec.ts',
};

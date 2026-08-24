module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|date-fns)/)',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '\\.spec\\.ts$',
    '\\.module\\.ts$',
    '\\.dto\\.ts$',
    '\\.interface\\.ts$',
    'main\\.ts$',
    'src/common/middleware/.*-rate-limit\\.middleware\\.ts$',
  ],
};

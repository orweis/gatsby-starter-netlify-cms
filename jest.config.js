// Jest configuration, following https://www.gatsbyjs.com/docs/how-to/testing/unit-testing/
module.exports = {
  testEnvironment: 'jsdom',
  // The root must include __mocks__/ so node_modules mocks are picked up.
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/test/**/*.test.js'],
  transform: {
    '^.+\\.jsx?$': '<rootDir>/test/jest-preprocess.js',
  },
  moduleNameMapper: {
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/file-mock.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/\\.cache/', '/public/'],
  modulePathIgnorePatterns: ['<rootDir>/public/', '<rootDir>/.cache/'],
  setupFilesAfterEnv: ['<rootDir>/test/setup-tests.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    'gatsby-node.js',
    'gatsby/**/*.js',
    'lambda/**/*.js',
    '!src/cms/cms.js',
  ],
}

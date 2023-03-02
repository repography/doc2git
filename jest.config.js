// @ts-check
const nextJest = require("next/jest");

// @ts-ignore
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

/** @type {import('@jest/types').Config.InitialOptions} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
    moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/__helpers__/",
  ],
  setupFilesAfterEnv: [
    "<rootDir>/src/__tests__/__helpers__/jest-setup.ts",
  ],
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/__helpers__/",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);

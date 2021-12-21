module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "src/**/*.js", "src/**/*.vue"],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/main.ts",
    "<rootDir>/src/components/three",
    "<rootDir>/src/assets/three",
    "<rootDir>/src/assets/gsap",
    "<rootDir>/src/views/simulate",
  ],
  moduleFileExtensions: [
    "js",
    "ts",
    "json",
    "vue"
  ],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testURL: "http://localhost/",
  transformIgnorePatterns: ["node_modules/(?!three|@tensorflow/tfjs|@tensorflow/tfjs-converter|handtrackjs|lodash-es)"],
  transform: {
    ".*\\.(vue)$": "vue-jest",
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/util/setup.ts"]
};

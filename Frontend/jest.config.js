module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "src/**/*.js", "src/**/*.vue"],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/main.ts",
    "<rootDir>/src/components/three",
    "<rootDir>/src/components/ui/sim",
    "<rootDir>/src/components/ui/widgets/carousel/carousel-scene.vue",
    "<rootDir>/src/assets/three",
    "<rootDir>/src/assets/gsap",
    "<rootDir>/src/views/simulate",
    "<rootDir>/src/views/welcome/welcome-scene.vue",
    "<rootDir>/src/views/create/builder/preview/preview-3d.vue"
  ],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
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
  transformIgnorePatterns: [
    "node_modules/(?!three|lodash-es|@popperjs/core)"
  ],
  transform: {
    ".*\\.(vue)$": "vue-jest",
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/util/setup.ts"]
};

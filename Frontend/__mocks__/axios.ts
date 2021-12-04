interface AxiosMockInstance {
  get?: jest.MockedFunction<any>;
  post?: jest.MockedFunction<any>;
  delete?: jest.MockedFunction<any>;
  put?: jest.MockedFunction<any>;
  patch?: jest.MockedFunction<any>;
  request?: jest.MockedFunction<any>;
}

const mockAPI : AxiosMockInstance = {
  delete: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  request: jest.fn(),
};

const axios = { create: jest.fn().mockImplementation(() => (mockAPI)) };

jest.mock("axios", () => ({
  default: jest.fn().mockImplementation(() => (axios)),
  ...axios
}));

export default axios;
export { axios, AxiosMockInstance };

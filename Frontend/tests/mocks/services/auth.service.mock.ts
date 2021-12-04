import { GenericApiErrorResponse } from "@/services/abstract-api.service";
import { AuthFailureResponse, AuthRequest, AuthSuccessResponse } from "@/services/auth.service";
import axios from "../../../__mocks__/axios";
import { resetAllWhenMocks, when } from "../../util/jest-when";


const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

const testUser = {
  username: "testuser",
  password: "12345",
  token: jwtToken,
}

const validLoginRequest: AuthRequest = {
  username: "ernest",
  password: "12345"
};

const guestLoginRequest: AuthRequest = {
  username: "guest",
  password: "some-password"
};

const invalidLoginRequest: AuthRequest = {
  username: "aaaa",
  password: "some-password"
};

const wrongUsernameLoginRequest: AuthRequest = {
  username: "ccc",
  password: "ddd"
};

const wrongPasswordLoginRequest: AuthRequest = {
  username: "bbb",
  password: "aaa"
};

const genericErrorRequest: AuthRequest = {
  username: "generic",
  password: "sfdsanfjkd"
};

const authSuccessResponse: AuthSuccessResponse = {
  user_id: 1,
  token: jwtToken,
};

const wrongUsernameLoginResponse: AuthFailureResponse = {
  errors: { username: ["incorrect"] },
  status: "unprocessable_entity"
};

const wrongPasswordLoginResponse: AuthFailureResponse = {
  errors: { password: ["incorrect"] },
  status: "unprocessable_entity"
};

const invalidParametersResponse: GenericApiErrorResponse = {
  error: "aaa"
};

const genericErrorResponse: GenericApiErrorResponse = {
  error: "The server did not respond. Please try again later."
};

const setupAuthServiceMock = () => {
  const mockAPI = axios.create();
  const loginEndpoint = "login";
  const registerEndpoint = "register";

  when(mockAPI.request)
    .calledWith({
      method: "POST",
      url: loginEndpoint,
      params: {},
      data: { user: validLoginRequest }
    })
    .mockResolvedValue({ data: authSuccessResponse });

  when(mockAPI.request)
    .calledWith({
      method: "POST",
      url: registerEndpoint,
      params: {},
      data: { user: validLoginRequest }
    })
    .mockResolvedValue({ data: authSuccessResponse });

  when(mockAPI.request)
    .calledWith({
      method: "GET",
      url: "guest_username",
      params: {},
      data: {}
    })
    .mockResolvedValue({ data: { username: guestLoginRequest.username } });

  when(mockAPI.request)
    .calledWith({
      method: "POST",
      url: loginEndpoint,
      params: {},
      data: { user: guestLoginRequest }
    })
    .mockResolvedValue({ data: authSuccessResponse });

  when(mockAPI.request)
    .calledWith({
      method: "POST",
      url: loginEndpoint,
      params: {},
      data: { user: invalidLoginRequest }
    })
    .mockRejectedValue({ response: { data: invalidParametersResponse } });

  when(mockAPI.request)
    .calledWith({
      method: "POST",
      url: loginEndpoint,
      params: {},
      data: { user: wrongUsernameLoginRequest }
    })
    .mockRejectedValue({ response: { data: wrongUsernameLoginResponse } });

  when(mockAPI.request)
    .calledWith({
      method: "POST",
      url: loginEndpoint,
      params: {},
      data: { user: wrongPasswordLoginRequest }
    })
    .mockRejectedValue({ response: { data: wrongPasswordLoginResponse } });

  when(mockAPI.request)
    .calledWith({
      method: "POST",
      url: loginEndpoint,
      params: {},
      data: { user: genericErrorRequest }
    })
    .mockRejectedValue({});
};

function resetAuthServiceMock() {
  resetAllWhenMocks();
}

export {
  setupAuthServiceMock,
  resetAuthServiceMock,
  jwtToken,
  testUser,
  validLoginRequest,
  invalidLoginRequest,
  guestLoginRequest,
  wrongUsernameLoginRequest,
  wrongPasswordLoginRequest,
  genericErrorRequest,
  authSuccessResponse,
  invalidParametersResponse,
  wrongUsernameLoginResponse,
  wrongPasswordLoginResponse,
  genericErrorResponse
};


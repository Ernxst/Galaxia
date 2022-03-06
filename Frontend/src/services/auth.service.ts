import { AbstractApiService, GenericApiErrorResponse } from "@/services/abstract-api.service";


export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthSuccessResponse {
  user_id: number,
  token: string
}

export type AuthFailureResponse = {
  errors: { username: string[] } | { password: string[] },
  status: string,
} | GenericApiErrorResponse

interface GuestUsernameSuccessResponse {
  username: string;
}

class AuthService extends AbstractApiService {
  public constructor() {
    super("users");
  }

  public async guestUsername(): Promise<string> {
    const response = await this.makeRequest<GuestUsernameSuccessResponse, GenericApiErrorResponse>({
      endpoint: "guest_username",
      method: "GET",
      auth: false,
    });
    if ("username" in response) return response.username;
    return Promise.reject(response.error);
  }

  public async userId(username: string): Promise<number> {
    const response = await this.makeRequest<{ user_id: number }, GenericApiErrorResponse>({
      endpoint: username,
      method: "GET",
      auth: true,
    });
    if ("error" in response) return Promise.reject(response.error);
    return response.user_id;
  }

  public guestLogin(guestUsername: string): Promise<string> {
    const user: AuthRequest = {
      username: guestUsername,
      password: "some-password"
    };
    return this.login(user);
  }

  public login(user: AuthRequest): Promise<string> {
    return this.authenticate("login", user);
  }

  public async logout(): Promise<string> {
    return "Success";
  }

  public register(user: AuthRequest): Promise<string> {
    return this.authenticate("register", user);
  }

  protected async authenticate(endpoint: "login" | "register",
    user: AuthRequest): Promise<string> {
    const response = await this.makeRequest<AuthSuccessResponse, AuthFailureResponse>({
      endpoint,
      method: "POST",
      body: { user },
      auth: false,
    });
    if ("token" in response) return response.token;
    if ("error" in response) return Promise.reject(response.error);
    const errors = response.errors;
    const message: string[] = "username" in errors ? errors.username : errors.password;
    return Promise.reject(message[0]);
  };
}

export default new AuthService();

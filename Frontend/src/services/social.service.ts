import { SimulationComment } from "@/@types/app";
import { cameliseKeys } from "@/assets/util/app.util";
import { AbstractApiService, GenericApiErrorResponse } from "@/services/abstract-api.service";


interface CommentResponse {
  id: number,
  createdAt: string,
}

export default class SocialService extends AbstractApiService {
  private static _instance: SocialService;

  public constructor() {
    super("simulations");
  }

  static instance(): SocialService {
    if (!SocialService._instance)
      SocialService._instance = new SocialService();
    return SocialService._instance;
  }

  public async fetchLikes(simulationID: number): Promise<string[]> {
    const response = await this.makeRequest<string[], GenericApiErrorResponse>({
      endpoint: `${simulationID}/likes`,
      method: "GET",
    });
    if ("error" in response) return Promise.reject(response.error);
    return <string[]>cameliseKeys(response);
  }

  public async fetchComments(simulationID: number): Promise<SimulationComment[]> {
    const response = await this.makeRequest<SimulationComment[], GenericApiErrorResponse>({
      endpoint: `${simulationID}/comments`,
      method: "GET",
    });
    if ("error" in response) return Promise.reject(response.error);
    return <SimulationComment[]>cameliseKeys(response);
  }

  public async like(simulationID: number, username: string): Promise<void> {
    const response = await this.makeRequest<null, GenericApiErrorResponse>({
      endpoint: `${simulationID}/likes`,
      method: "POST",
      body: { username: username },
    });
    if (response && "error" in response) return Promise.reject(response.error);
  }

  public async unlike(simulationID: number, username: string): Promise<void> {
    const response = await this.makeRequest<null, GenericApiErrorResponse>({
      endpoint: `${simulationID}/likes/${username}`,
      method: "DELETE",
    });
    if (response && "error" in response) return Promise.reject(response.error);
  }

  public async comment(simulationID: number, username: string,
    comment: string): Promise<CommentResponse> {
    const response = await this.makeRequest<CommentResponse, GenericApiErrorResponse>({
      endpoint: `${simulationID}/comments`,
      method: "POST",
      body: { data: { username: username, comment: comment } },
    });
    if ("error" in response) return Promise.reject(response.error);
    return <CommentResponse>cameliseKeys(response);
  }

  public async uncomment(simulationID: number, commentID: number): Promise<void> {
    const response = await this.makeRequest<null, GenericApiErrorResponse>({
      endpoint: `${simulationID}/comments/${commentID}`,
      method: "DELETE",
    });
    if (response && "error" in response) return Promise.reject(response.error);
  }
}

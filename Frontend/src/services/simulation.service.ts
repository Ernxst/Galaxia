import { StarSystem } from "@/@types/celestial/containers/star-system";
import { cameliseKeys } from "@/assets/util/app.util";
import { AbstractApiService, ApiErrorResponse, GenericApiErrorResponse } from "@/services/abstract-api.service";
import { SimulationData } from "@/views/create/util/types";
import { isString, sample } from "lodash-es";


type StarSystems = { [key: number]: StarSystem };


class SimulationService extends AbstractApiService {
  private static _instance: SimulationService;

  public constructor() {
    super("simulations");
  }

  static instance(): SimulationService {
    if (!SimulationService._instance)
      SimulationService._instance = new SimulationService();
    return SimulationService._instance;
  }

  public presetSimulations(): Promise<StarSystem[]> {
    return this.fetchSimulations("preset");
  }

  public async fetchSimulation(id: number): Promise<StarSystem> {
    const response = await this.makeRequest<StarSystem, GenericApiErrorResponse>({
      endpoint: `${id}`,
      method: "GET",
      auth: true,
    });
    if ("error" in response) return Promise.reject(response.error);
    return <StarSystem>cameliseKeys(response);
  }

  private async fetchSimulations(endpoint: string): Promise<StarSystem[]> {
    const response = await this.makeRequest<StarSystem[], GenericApiErrorResponse>({
      endpoint: `all/${endpoint}`,
      method: "GET",
      auth: true,
    });
    if (Array.isArray(response)) {
      const simulations: StarSystem[] = [];
      for (const snakeSim of response) {
        simulations.push(<StarSystem>cameliseKeys(snakeSim));
      }
      return simulations;
    }
    return Promise.reject(response.error);
  }

  public async createSimulation(simulation: SimulationData): Promise<number> {
    const response = await this.makeRequest<{ id: number }, ApiErrorResponse>({
      endpoint: '',
      method: "POST",
      auth: true,
      body: { simulation }
    });
    if ("id" in response) return response.id;
    if ("error" in response) return Promise.reject(response.error);
    const randomError = sample(response.errors);
    // @ts-ignore
    return Promise.reject(randomError[0]);
  }

  public async updateSimulation(simulationID: number, simulation: SimulationData) {
    const response = await this.makeRequest<"", ApiErrorResponse>({
      endpoint: `${simulationID}`,
      method: "PATCH",
      auth: true,
      body: { simulation }
    });
    if (isString(response)) return;
    if ("error" in response) return Promise.reject(response.error);
    const randomError = sample(response.errors);
    // @ts-ignore
    return Promise.reject(randomError[0]);
  }

  public async deleteSimulation(simulationID: number) {
    const response = await this.makeRequest<"", GenericApiErrorResponse>({
      endpoint: `${simulationID}`,
      method: "delete",
      auth: true,
    });
    if (isString(response)) return;
    return Promise.reject(response.error);
  }
}

export {
  SimulationService,
  StarSystems,
};

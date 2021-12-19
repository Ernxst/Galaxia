import { StarSystem } from "@/@types/celestial/containers/star-system";
import { cameliseKeys } from "@/assets/util/app.util";
import { AbstractApiService, GenericApiErrorResponse } from "@/services/abstract-api.service";


type StarSystems = { [key: number]: StarSystem };


class SimulationService extends AbstractApiService {
  static _instance: SimulationService;

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

  private async fetchSimulations(endpoint: string): Promise<StarSystem[]> {
    const response = await this.makeRequest<StarSystem[], GenericApiErrorResponse>({
      endpoint: `all/${endpoint}`,
      method: "GET",
    });
    if (Array.isArray(response)) {
      const simulations: StarSystem[] = [];
      for (const snakeSim of response) {
        simulations.push(<StarSystem>cameliseKeys(snakeSim))
      }
      return simulations;
    }
    return Promise.reject(response.error);
  }
}

export {
  SimulationService,
  StarSystems,
};

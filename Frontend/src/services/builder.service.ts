import { objectWithoutKeys } from "@/assets/util/app.util";
import { AbstractApiService, ApiErrorResponse, GenericApiErrorResponse } from "@/services/abstract-api.service";
import { AsteroidBeltData, MoonData, PlanetData, StarData } from "@/views/create/util/types";
import { isString, sample } from "lodash-es";


type CelestialRequestBody = { [key: string]: StarData | PlanetData | MoonData | AsteroidBeltData }

class BuilderService extends AbstractApiService {
  private static _instance: BuilderService;

  public constructor() {
    super("");
  }

  static instance(): BuilderService {
    if (!BuilderService._instance)
      BuilderService._instance = new BuilderService();
    return BuilderService._instance;
  }

  public async createStarForSimulation(simulationID: number, star: StarData): Promise<number> {
    return await this.createCelestialBodyForSimulation(simulationID, star, "star");
  }

  public async updateStar(simulationID: number, starID: number, star: StarData) {
    return await this.updateCelestialBody(simulationID, starID, star, "star");
  }

  public async createPlanetForSimulation(simulationID: number, planet: PlanetData): Promise<number> {
    return await this.createCelestialBodyForSimulation(simulationID, planet, "planet");
  }

  public async updatePlanet(simulationID: number, planetID: number, planet: PlanetData) {
    return await this.updateCelestialBody(simulationID, planetID, planet, "planet");
  }

  public async deletePlanet(simulationID: number, planetID: number) {
    return await this.deleteCelestialBody(simulationID, planetID, "planets");
  }

  public async createMoonForSimulation(simulationID: number, moon: MoonData): Promise<number> {
    return await this.createCelestialBodyForSimulation(simulationID, moon, "moon");
  }

  public async updateMoon(simulationID: number, moonID: number, moon: MoonData) {
    return await this.updateCelestialBody(simulationID, moonID, moon, "moon");
  }

  public async deleteMoon(simulationID: number, planetID: number, moonID: number) {
    return await this.deleteCelestialBody(simulationID, moonID, `planets/${planetID}/moons`);
  }

  public async createAsteroidBeltForSimulation(simulationID: number, asteroidBelt: AsteroidBeltData): Promise<number> {
    return await this.createCelestialBodyForSimulation(simulationID, asteroidBelt, "asteroid_belt");
  }

  public async updateAsteroidBelt(simulationID: number, asteroidBeltID: number, asteroidBelt: AsteroidBeltData) {
    return await this.updateCelestialBody(simulationID, asteroidBeltID, asteroidBelt, "asteroid_belt");
  }

  public async deleteAsteroidBelt(simulationID: number, asteroidBeltID: number) {
    return await this.deleteCelestialBody(simulationID, asteroidBeltID, "asteroid_belts");
  }

  private getEndpoint(simulationID: number,
                      payload: StarData | PlanetData | MoonData | AsteroidBeltData,
                      type: "star" | "planet" | "moon" | "asteroid_belt") {
    let endpoint;
    if (type === "moon") {
      // @ts-ignore
      const planetID = payload.parentId;
      payload = <MoonData>objectWithoutKeys(payload, "parentId");
      endpoint = `simulations/${simulationID}/planets/${planetID}/moons`;
    } else {
      endpoint = `simulations/${simulationID}/${type}s`;
    }
    return { payload, endpoint };
  }

  private async createCelestialBodyForSimulation(simulationID: number,
                                                 data: StarData | PlanetData | MoonData | AsteroidBeltData,
                                                 type: "star" | "planet" | "moon" | "asteroid_belt"): Promise<number> {
    const { endpoint, payload } = this.getEndpoint(simulationID, data, type);
    const id = await this.createCelestialBody(data, type);
    const body: CelestialRequestBody = {};
    body[type] = payload;

    const response = await this.makeRequest<{ id: number }, ApiErrorResponse>({
      endpoint: `${endpoint}/${id}`,
      method: "POST",
      auth: true,
      body: body
    });

    if ("id" in response) return response.id;
    if ("error" in response) return Promise.reject(response.error);
    const randomError = sample(response.errors);
    // @ts-ignore
    return Promise.reject(randomError[0]);
  }

  public async createCelestialBody(data: StarData | PlanetData | MoonData | AsteroidBeltData,
                                   type: "star" | "planet" | "moon" | "asteroid_belt"): Promise<number> {
    const body: CelestialRequestBody = {};
    body[type] = data;

    const response = await this.makeRequest<{ id: number }, ApiErrorResponse>({
      endpoint: `celestial/${type}s`,
      method: "POST",
      auth: true,
      body: body
    });

    if ("id" in response) return response.id;
    if ("error" in response) return Promise.reject(response.error);
    const randomError = sample(response.errors);
    // @ts-ignore
    return Promise.reject(randomError[0]);
  }

  public async updateCelestialBody(simulationID: number, id: number,
                                   data: StarData | PlanetData | MoonData | AsteroidBeltData,
                                   type: "star" | "planet" | "moon" | "asteroid_belt") {
    const { endpoint, payload } = this.getEndpoint(simulationID, data, type);
    const body: CelestialRequestBody = {};
    body[type] = payload;

    const response = await this.makeRequest<"", ApiErrorResponse>({
      endpoint: `${endpoint}/${id}`,
      method: "PATCH",
      auth: true,
      body: body
    });

    if (isString(response)) return;
    if ("error" in response) return Promise.reject(response.error);
    const randomError = sample(response.errors);
    // @ts-ignore
    return Promise.reject(randomError[0]);
  }

  private async deleteCelestialBody(simulationID: number, id: number, endpoint: string) {
    const response = await this.makeRequest<"", GenericApiErrorResponse>({
      endpoint: `simulations/${simulationID}/${endpoint}/${id}`,
      method: "DELETE",
      auth: true,
    });

    if (isString(response)) return;
    return Promise.reject(response.error);
  }
}

export {
  BuilderService,
};

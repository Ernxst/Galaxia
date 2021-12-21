import axios from "../../../__mocks__/axios";
import { resetAllWhenMocks, when } from "../../util/jest-when";
import { presetSimulationArray, userCreatedSimulations } from "../types/simulation.mock";
import { authHeader } from "./auth.service.mock";


const setupSimulationServiceMock = () => {
  const mockAPI = axios.create();

  when(mockAPI.request)
    .calledWith({
      method: "GET",
      url: "all/preset",
      params: {},
      data: {},
      headers: authHeader,
    })
    .mockResolvedValue({ data: presetSimulationArray(3) });


  when(mockAPI.request)
    .calledWith({
      method: "GET",
      url: "all/user",
      params: {},
      data: {},
      headers: authHeader,
    })
    .mockResolvedValue({ data: userCreatedSimulations(3) });

};

const resetSimulationServiceMock = () => {
  resetAllWhenMocks();
};

export {
  setupSimulationServiceMock,
  resetSimulationServiceMock,
};

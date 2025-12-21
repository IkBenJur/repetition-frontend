import { getApiClient } from "../lib/apiClient";
import type { Exercise } from "../types/exercise.types";

export const exerciseService = {
  getExercises: async (): Promise<Exercise[]> => {
    const api = getApiClient();
    return api.get("/exercise");
  },
};

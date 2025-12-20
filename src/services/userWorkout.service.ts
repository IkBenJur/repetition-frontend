import { getApiClient } from "../lib/apiClient";
import type { UserWorkout } from "../types/userWorkouts.types";

export const userWorkoutService = {
  getActiveWorkout: async (): Promise<UserWorkout> => {
    const api = getApiClient();
    return api.get("/userWorkout/active");
  },
};

import { getApiClient } from "../lib/apiClient";
import type {
  MarkUserWorkoutAsCompleteResponse,
  UserWorkout,
} from "../types/userWorkouts.types";

export const userWorkoutService = {
  getActiveWorkout: async (): Promise<UserWorkout> => {
    const api = getApiClient();
    return api.get("/userWorkout/active");
  },

  markWorkoutAsComplete: async (
    userWorkoutId: number,
  ): Promise<MarkUserWorkoutAsCompleteResponse> => {
    const api = getApiClient();
    return api.put(`/userWorkout/${userWorkoutId}/mark-complete`);
  },
};

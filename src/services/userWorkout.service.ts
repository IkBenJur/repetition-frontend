import { getApiClient } from "../lib/apiClient";
import type {
  MarkUserWorkoutAsCompleteResponse,
  NewUserWorkoutFormData,
  UserWorkout,
} from "../types/userWorkouts.types";

export const userWorkoutService = {
  getActiveWorkout: async (): Promise<UserWorkout> => {
    const api = getApiClient();
    return api.get("/userWorkout/active");
  },

  addNewUserWorkout: async (
    userWorkout: NewUserWorkoutFormData,
  ): Promise<UserWorkout> => {
    const api = getApiClient();
    return api.post("/userWorkout", userWorkout);
  },

  markWorkoutAsComplete: async (
    userWorkoutId: number,
  ): Promise<MarkUserWorkoutAsCompleteResponse> => {
    const api = getApiClient();
    return api.put(`/userWorkout/${userWorkoutId}/mark-complete`);
  },

  getAllUserworkouts: async (): Promise<UserWorkout[]> => {
    const api = getApiClient();
    return api.get("/userWorkout");
  },

  getUserworkoutById: async (userWorkoutId: number): Promise<UserWorkout> => {
    const api = getApiClient();
    return api.get(`/userWorkout/${userWorkoutId}`);
  },
};

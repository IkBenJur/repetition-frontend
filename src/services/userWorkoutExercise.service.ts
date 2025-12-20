import { getApiClient } from "../lib/apiClient";
import type { UserWorkoutExercise } from "../types/userWorkoutExercise.types";

export const userWorkoutExerciseService = {
  createNewUserWorkoutExercise: async (
    userWorkoutExercise: UserWorkoutExercise,
  ): Promise<UserWorkoutExercise> => {
    const api = getApiClient();
    return api.post("/userWorkoutExercise", userWorkoutExercise);
  },
};

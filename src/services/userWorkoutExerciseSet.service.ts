import { getApiClient } from "../lib/apiClient";
import type { UserWorkoutExerciseSet } from "../types/userWorkoutExerciseSet.types";

export const userWorkoutExerciseSetService = {
  createNewUserWorkoutExerciseSet: async (
    userWorkoutExerciseSet: UserWorkoutExerciseSet,
  ): Promise<UserWorkoutExerciseSet> => {
    const api = getApiClient();
    return api.post("userWorkoutExerciseSet", userWorkoutExerciseSet);
  },
};

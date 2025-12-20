import { useMutation } from "@tanstack/react-query";
import { userWorkoutExerciseSetService } from "../../services/userWorkoutExerciseSet.service";
import type { UserWorkoutExerciseSet } from "../../types/userWorkoutExerciseSet.types";

export const useUserWorkoutExerciseSetMutation = () => {
  return useMutation({
    mutationFn: (userWorkoutExerciseSet: UserWorkoutExerciseSet) =>
      userWorkoutExerciseSetService.createNewUserWorkoutExerciseSet(
        userWorkoutExerciseSet,
      ),
  });
};

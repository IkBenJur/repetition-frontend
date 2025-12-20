import { useMutation } from "@tanstack/react-query";
import type { UserWorkoutExercise } from "../../types/userWorkoutExercise.types";
import { userWorkoutExerciseService } from "../../services/userWorkoutExercise.service";

export const useCreateUserWorkoutExerciseMutation = () => {
  return useMutation({
    mutationFn: (userWorkoutExercise: UserWorkoutExercise) =>
      userWorkoutExerciseService.createNewUserWorkoutExercise(
        userWorkoutExercise,
      ),
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

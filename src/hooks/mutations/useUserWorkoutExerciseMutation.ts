import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserWorkoutExercise } from "../../types/userWorkoutExercise.types";
import { userWorkoutExerciseService } from "../../services/userWorkoutExercise.service";
import type { UserWorkout } from "../../types/userWorkouts.types";

export const useCreateUserWorkoutExerciseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userWorkoutExercise: UserWorkoutExercise) =>
      userWorkoutExerciseService.createNewUserWorkoutExercise(
        userWorkoutExercise,
      ),
    onSuccess: (createdExercise) => {
      // Update the cache
      queryClient.setQueryData<UserWorkout>(
        ["activeUserWorkout"],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            UserWorkoutExercises: [
              ...oldData.UserWorkoutExercises,
              createdExercise,
            ],
          };
        },
      );
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

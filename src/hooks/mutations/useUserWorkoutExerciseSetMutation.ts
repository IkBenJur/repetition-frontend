import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userWorkoutExerciseSetService } from "../../services/userWorkoutExerciseSet.service";
import type { UserWorkoutExerciseSet } from "../../types/userWorkoutExerciseSet.types";
import type { UserWorkout } from "../../types/userWorkouts.types";

export const useCreateUserWorkoutExerciseSetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userWorkoutExerciseSet: UserWorkoutExerciseSet) =>
      userWorkoutExerciseSetService.createNewUserWorkoutExerciseSet(
        userWorkoutExerciseSet,
      ),
    onSuccess: (createdSet) => {
      queryClient.setQueryData<UserWorkout>(
        ["activeUserWorkout"],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            UserWorkoutExercises: oldData.UserWorkoutExercises.map(
              (exercise) => {
                // Do nothing when set is not equal to the user exercise
                if (exercise.ID != createdSet.UserWorkoutExerciseId) {
                  return exercise;
                }

                // Update the user exercise by adding the new set
                return {
                  ...exercise,
                  UserWorkoutExerciseSets: [
                    ...exercise.UserWorkoutExerciseSets,
                    createdSet,
                  ],
                };
              },
            ),
          };
        },
      );
    },
  });
};

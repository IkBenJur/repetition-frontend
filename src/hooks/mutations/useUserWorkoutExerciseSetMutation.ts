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

export const useUpdateUserWorkoutExerciseSet = () => {
  const queryClient = useQueryClient();
  const queryKey = ["activeUserWorkout"];

  return useMutation({
    mutationFn: (exerciseSet: UserWorkoutExerciseSet) =>
      userWorkoutExerciseSetService.updateUserWorkoutExerciseSet(exerciseSet),

    // Optomistally update the set.
    // Save the oldState so we're able to rollback the update if it fails
    onMutate: (updatedSet) => {
      queryClient.cancelQueries({ queryKey });

      // Save the old state
      const prevData = queryClient.getQueryData<UserWorkout>(queryKey);

      // Update the state with the new set
      queryClient.setQueryData<UserWorkout>(queryKey, (oldData) => {
        if (!oldData) {
          return oldData;
        }

        // Update the set in the userWorkout
        return {
          ...oldData,
          UserWorkoutExercises: oldData.UserWorkoutExercises.map((exercise) => {
            // Do nothing when set is not equal to the user exercise
            if (exercise.ID != updatedSet.UserWorkoutExerciseId)
              return exercise;

            // Update the correct set for the exercise
            return {
              ...exercise,
              UserWorkoutExerciseSets: exercise.UserWorkoutExerciseSets.map(
                (set) => {
                  if (set.ID != updatedSet.ID) return set;
                  return updatedSet;
                },
              ),
            };
          }),
        };
      });

      // Return the context object with the prevData
      return { prevData };
    },
    // Rolback to old state when fails
    onError: (_, __, context) => {
      if (context?.prevData) {
        queryClient.setQueryData<UserWorkout>(queryKey, context.prevData);
      }

      // TODO Send notification to user when failed
    },
  });
};

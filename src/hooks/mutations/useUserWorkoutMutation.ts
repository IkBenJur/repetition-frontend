import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userWorkoutService } from "../../services/userWorkout.service";

export const useUserWorkoutMarkAsCompleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userWorkoutId: number) =>
      userWorkoutService.markWorkoutAsComplete(userWorkoutId),
    onSuccess: (markUserWorkoutAsCompleteResponse) => {
      // Invalidate the cache for activeWorkout when is was the active workout
      if (markUserWorkoutAsCompleteResponse.wasActiveWorkout) {
        queryClient.invalidateQueries({ queryKey: ["activeUserWorkout"] });
      }

      // TODO Also update for once we have userWorkout specific routes
    },
  });
};

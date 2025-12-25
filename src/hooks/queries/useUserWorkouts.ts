import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { userWorkoutService } from "../../services/userWorkout.service";

export const activeUserWorkoutQuery = () => {
  return queryOptions({
    queryKey: ["activeUserWorkout"],
    queryFn: () => userWorkoutService.getActiveWorkout(),
  });
};

export const useSuspenseActiveUserWorkout = () => {
  return useSuspenseQuery(activeUserWorkoutQuery());
};

export const allUserWorkoutsQuery = () => {
  return queryOptions({
    queryKey: ["allUserWorkouts"],
    queryFn: () => userWorkoutService.getAllUserworkouts(),
  });
};

export const useSuspenseAllUserWorkoutsQuery = () => {
  return useSuspenseQuery(allUserWorkoutsQuery());
};

export const getUserWorkoutQuery = (userWorkoutId: number) => {
  return queryOptions({
    queryKey: ["userWorkout", userWorkoutId],
    queryFn: () => userWorkoutService.getUserworkoutById(userWorkoutId),
  });
};

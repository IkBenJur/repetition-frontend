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

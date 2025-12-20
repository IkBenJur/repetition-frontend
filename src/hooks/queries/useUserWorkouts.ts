import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { userWorkoutService } from "../../services/userWorkout.service";

export const activeUserWorkoutQuery = (jwt: string) => {
  return queryOptions({
    queryKey: ["activeUserWorkout", jwt],
    queryFn: () => userWorkoutService.getActiveWorkout(jwt),
  });
};

export const useSuspenseActiveUserWorkout = (jwt: string) => {
  return useSuspenseQuery(activeUserWorkoutQuery(jwt));
};

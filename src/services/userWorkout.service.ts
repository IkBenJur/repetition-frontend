import { env } from "../lib/env";
import type { UserWorkout } from "../types/userWorkouts.types";

export const userWorkoutService = {
  getActiveWorkout: async (jwt: string): Promise<UserWorkout> => {
    const response = await fetch(`${env.apiUrl}/userWorkout/active`, {
      headers: { Authorization: jwt },
    });

    if (!response.ok) {
      console.error(response.statusText);
      throw new Error("Failed to fetch active UserWorkout");
    }

    return response.json();
  },
};

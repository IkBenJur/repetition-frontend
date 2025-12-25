import type { UserWorkoutExercise } from "./userWorkoutExercise.types";

export interface UserWorkout {
  ID: number;
  Name: string;
  DateStart: string;
  DateEnd?: string;
  UserWorkoutExercises: UserWorkoutExercise[];
}

export interface MarkUserWorkoutAsCompleteResponse {
  userWorkout: UserWorkout;
  wasActiveWorkout: boolean;
}

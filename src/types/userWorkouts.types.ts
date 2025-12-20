import type { UserWorkoutExercise } from "./userWorkoutExercise.types";

export interface UserWorkout {
  ID: number;
  Name: string;
  DateStart: string;
  UserWorkoutExercises: UserWorkoutExercise[];
}

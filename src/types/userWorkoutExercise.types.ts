import type { UserWorkoutExerciseSet } from "./userWorkoutExerciseSet.types";

export interface UserWorkoutExercise {
  ID?: number;
  UserWorkoutId: number;
  ExerciseId: number;
  UserWorkoutExerciseSets: UserWorkoutExerciseSet[];
}

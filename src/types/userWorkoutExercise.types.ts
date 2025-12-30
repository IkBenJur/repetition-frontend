import type {
  NewUserWorkoutExerciseSetFormData,
  UserWorkoutExerciseSet,
} from "./userWorkoutExerciseSet.types";

export interface NewUserWorkoutExerciseFormData {
  exerciseId: number;

  userWorkoutExerciseSets?: NewUserWorkoutExerciseSetFormData[];
}

export interface UserWorkoutExercise {
  ID?: number;
  UserWorkoutId: number;
  ExerciseId: number;
  ExerciseName: string;
  UserWorkoutExerciseSets: UserWorkoutExerciseSet[];
}

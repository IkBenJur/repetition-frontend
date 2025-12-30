export interface NewUserWorkoutExerciseSetFormData {
  weight: number;
  reps: number;
}

export interface UserWorkoutExerciseSet {
  ID?: number;
  UserWorkoutExerciseId: number;
  Reps?: number;
  Weight?: number;
  SetNumber?: number;
  IsDone: boolean;
}

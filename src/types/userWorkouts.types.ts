export interface UserWorkoutExerciseSet {
  ID: number;
  Reps: number;
  Weight: number;
}

export interface UserWorkoutExercise {
  ID: number;
  UserWorkoutId: number;
  ExerciseId: number;
  UserWorkoutExerciseSets: UserWorkoutExerciseSet[];
}

export interface UserWorkout {
  ID: number;
  Name: string;
  DateStart: string;
  UserWorkoutExercises: UserWorkoutExercise[];
}

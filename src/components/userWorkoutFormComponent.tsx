import { formatDate } from "date-fns";
import type { UserWorkout } from "../types/userWorkouts.types";
import { Fragment, useState } from "react";
import { useCreateUserWorkoutExerciseMutation } from "../hooks/mutations/useUserWorkoutExerciseMutation";
import type { UserWorkoutExercise } from "../types/userWorkoutExercise.types";
import type { UserWorkoutExerciseSet } from "../types/userWorkoutExerciseSet.types";
import { useCreateUserWorkoutExerciseSetMutation } from "../hooks/mutations/useUserWorkoutExerciseSetMutation";
import { ExerciseSelectModal } from "./exercises/exerciseSelectModal";
import { useGetAllExerciseQuery } from "../hooks/queries/useExercise";
import { UserWorkoutExerciseSetTable } from "./userWorkoutExerciseSet/userWorkoutExerciseSet";

interface UserWorkoutFormProps {
  userWorkout: UserWorkout;
}

export const UserWorkoutForm = ({ userWorkout }: UserWorkoutFormProps) => {
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const createExerciseMutation = useCreateUserWorkoutExerciseMutation();
  const createSetMutation = useCreateUserWorkoutExerciseSetMutation();
  const exerciseQuery = useGetAllExerciseQuery();

  const handleAddExercise = (exerciseId: number, exerciseName: string) => {
    const newExercise: UserWorkoutExercise = {
      UserWorkoutId: userWorkout.ID,
      ExerciseId: exerciseId,
      ExerciseName: exerciseName,
      UserWorkoutExerciseSets: [],
    };

    createExerciseMutation.mutate(newExercise);
  };

  const handleAddSet = (exerciseId: number) => {
    const newSet: UserWorkoutExerciseSet = {
      UserWorkoutExerciseId: exerciseId,
      IsDone: false,
    };

    createSetMutation.mutate(newSet);
  };

  return (
    <Fragment>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{userWorkout.Name}</h1>
        <p className="text-base-content/60">
          {formatDate(new Date(userWorkout.DateStart), "d MMMM, yyyy")}
        </p>
      </div>

      <div className="space-y-4">
        {userWorkout.UserWorkoutExercises.map((exercise) => (
          <div key={exercise.ID} className="card bg-base-300 shadow-md">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">
                {exercise.ExerciseName}
              </h2>

              <UserWorkoutExerciseSetTable
                userWorkoutExerciseSets={exercise.UserWorkoutExerciseSets}
                canUpdateSets={true}
              />

              <div className="card-actions">
                <button
                  onClick={() => handleAddSet(exercise.ID!)}
                  disabled={createSetMutation.isPending}
                  className="btn btn-block bg-base-200 hover:bg-base-100"
                >
                  {createSetMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Adding Set...
                    </>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                  Add set
                </button>
              </div>
            </div>
          </div>
        ))}

        <ExerciseSelectModal
          isOpen={isExerciseModalOpen}
          exercises={exerciseQuery.data || []}
          isError={exerciseQuery.isError}
          isLoading={exerciseQuery.isLoading}
          onSelect={handleAddExercise}
          closeFunction={() => setIsExerciseModalOpen(false)}
        />

        <button
          onClick={() => setIsExerciseModalOpen(true)}
          disabled={createExerciseMutation.isPending}
          className="btn btn-primary btn-block"
        >
          {createExerciseMutation.isPending ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Adding Exercise...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Exercise
            </>
          )}
        </button>

        {createExerciseMutation.isError && (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{createExerciseMutation.error.message}</span>
          </div>
        )}
      </div>
    </Fragment>
  );
};

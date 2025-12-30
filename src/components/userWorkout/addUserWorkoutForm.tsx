import { useFieldArray, useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAddUserWorkoutMutation } from "../../hooks/mutations/useUserWorkoutMutation";
import { useNavigate } from "@tanstack/react-router";
import { ExerciseSelectModal } from "../exercises/exerciseSelectModal";
import { useGetAllExerciseQuery } from "../../hooks/queries/useExercise";
import { useState } from "react";

const setFormSchema = z.object({
  weight: z.number().min(0),
  reps: z.number().min(0),
});

const exerciseFormSchema = z.object({
  exerciseId: z.int(),
  userWorkoutExerciseSets: z.array(setFormSchema).optional(),

  // Only used in data display. Not send to server
  name: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().min(1).max(120).trim(),
  exercises: z.array(exerciseFormSchema).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ExerciseFieldProps {
  index: number;
  control: Control<FormData>;
  exerciseName?: string;
  onRemove: () => void;
}

const ExerciseField = ({
  index,
  control,
  exerciseName,
  onRemove,
}: ExerciseFieldProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `exercises.${index}.userWorkoutExerciseSets`,
  });

  return (
    <div className="card bg-base-100 shadow-md mb-4">
      <div className="card-body p-4">
        {/* Exercise Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">{exerciseName}</h3>
          <button
            type="button"
            onClick={onRemove}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Remove exercise"
          >
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
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Sets Table */}
        {fields.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Set</th>
                  <th>Reps</th>
                  <th>Weight</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, setIndex) => (
                  <tr key={field.id}>
                    <td className="font-semibold">{setIndex + 1}</td>
                    <td>
                      <input
                        type="number"
                        className="input input-sm w-20"
                        placeholder="0"
                        {...control.register(
                          `exercises.${index}.userWorkoutExerciseSets.${setIndex}.reps`,
                          { valueAsNumber: true },
                        )}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.125"
                        className="input input-sm w-20"
                        placeholder="0"
                        {...control.register(
                          `exercises.${index}.userWorkoutExerciseSets.${setIndex}.weight`,
                          { valueAsNumber: true },
                        )}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => remove(setIndex)}
                        className="btn btn-ghost btn-sm btn-circle"
                        aria-label="Remove set"
                      >
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
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Set Button */}
        <button
          type="button"
          onClick={() => append({ weight: 0, reps: 0 })}
          className="btn btn-outline btn-sm mt-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Set
        </button>
      </div>
    </div>
  );
};

export const AddUserWorkoutForm = () => {
  const navigate = useNavigate();
  const { data, isError, isLoading } = useGetAllExerciseQuery();
  const [exerciseModalIsOpen, setExerciseModalIsOpen] = useState(false);
  const addWorkoutMutation = useAddUserWorkoutMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Todo create default name like. Workout [DATETIME]
      name: "",

      exercises: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "exercises",
  });

  const onSubmit = async (data: FormData) => {
    try {
      await addWorkoutMutation.mutateAsync({
        name: data.name,
        userWorkoutExercises: data.exercises,
      });

      reset();

      // Navigate to the active user workout
      navigate({
        to: "/activeWorkout",
      });
    } catch (error) {
      console.error("Error creating workout:", error);
      setError("root", {
        type: "manual",
        message: "Failed to create workout. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Create New Workout</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Root error (server errors) */}
            {errors.root && (
              <div className="alert alert-error">
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
                <span>{errors.root.message}</span>
              </div>
            )}

            {/* Name Field */}
            <div className="form-control w-full">
              <label htmlFor="name" className="label">
                <span className="label-text font-semibold">Workout Name</span>
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                placeholder="e.g., Leg Day"
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : ""
                }`}
                disabled={isSubmitting}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name.message}
                  </span>
                </label>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-lg">Exercises (Optional)</h3>
              <p className="text-sm text-base-content/70 mt-1">
                Feel free to pre-add your exercises and sets now, or add them
                later during your workout.
              </p>
            </div>

            {/* All the exercise fields */}
            {fields.length > 0 && (
              <div className="space-y-4">
                <label className="label">
                  <span className="label-text font-semibold">Exercises</span>
                </label>
                {fields.map((field, index) => (
                  <ExerciseField
                    key={field.id}
                    index={index}
                    control={control}
                    exerciseName={field.name || ""}
                    onRemove={() => remove(index)}
                  />
                ))}
              </div>
            )}

            {/* Add new exercise to form*/}
            <ExerciseSelectModal
              exercises={data || []}
              isError={isError}
              isLoading={isLoading}
              isOpen={exerciseModalIsOpen}
              closeFunction={() => setExerciseModalIsOpen(false)}
              onSelect={(exerciseId) => {
                const exerciseName = data?.find(
                  (exercise) => exercise.ID == exerciseId,
                )?.Name;
                append({ exerciseId: exerciseId, name: exerciseName });
              }}
            />

            <button
              onClick={() => setExerciseModalIsOpen(true)}
              type="button"
              className="btn btn-primary btn-block"
            >
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
            </button>

            {/* Submit Button */}
            <div className="card-actions justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting || addWorkoutMutation.isPending}
                className="btn btn-success w-full"
              >
                {isSubmitting || addWorkoutMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  "Create Workout"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

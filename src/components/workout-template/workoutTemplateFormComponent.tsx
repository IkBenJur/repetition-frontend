import { useState } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ExerciseSelectModal } from "../exercises/exerciseSelectModal";
import { useGetAllExerciseQuery } from "../../hooks/queries/useExercise";

// Zod schemas
const setSchema = z
  .object({
    reps: z.number().min(1).max(100).optional(),
    loadPrescription: z.enum(["Fixed", "Percentage", "RPE"]),
    weight: z.number().min(0).optional(),
    percentageOfMax: z.number().min(0).max(100).optional(),
    rpe: z.number().min(1).max(10).optional(),
  })
  .refine((data) => data.reps !== undefined && data.reps !== null, {
    message: "Reps is required",
    path: ["reps"],
  });

const exerciseSchema = z.object({
  exerciseId: z.number(),
  name: z.string().optional(),
  sets: z.array(setSchema).min(1),
});

const workoutTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required").max(120).trim(),
  exercises: z
    .array(exerciseSchema)
    .min(1, "At least one exercise is required"),
});

type FormData = z.infer<typeof workoutTemplateSchema>;
type Exercise = z.infer<typeof exerciseSchema>;
type Set = z.infer<typeof setSchema>;

interface ExerciseFieldProps {
  index: number;
  control: Control<FormData>;
  exerciseName: string;
  exerciseError?: FieldErrors<Exercise>;
  onRemove: () => void;
}

const ExerciseField = ({
  index,
  control,
  exerciseName,
  exerciseError,
  onRemove,
}: ExerciseFieldProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `exercises.${index}.sets`,
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
                  <th>Load type</th>
                  <th>Load</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, setIndex) => (
                  <SetRow
                    key={field.id}
                    setIndex={setIndex}
                    exerciseIndex={index}
                    control={control}
                    setError={exerciseError?.sets?.[setIndex]}
                    onRemove={() => remove(setIndex)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Set Button */}
        <button
          type="button"
          onClick={() => append({ loadPrescription: "Fixed" })}
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

interface SetRowProps {
  setIndex: number;
  exerciseIndex: number;
  control: Control<FormData>;
  setError?: FieldErrors<Set>;
  onRemove: () => void;
}

const SetRow = ({
  setIndex,
  exerciseIndex,
  control,
  setError,
  onRemove,
}: SetRowProps) => {
  const loadPrescription = useWatch({
    control,
    name: `exercises.${exerciseIndex}.sets.${setIndex}.loadPrescription`,
    defaultValue: "Fixed",
  });

  return (
    <tr>
      {/* Set Number */}
      <td className="font-semibold">{setIndex + 1}</td>

      {/* Reps */}
      <td>
        <input
          type="number"
          className={`input input-sm w-14 ${setError?.reps ? "input-error" : ""}`}
          placeholder="10"
          {...control.register(
            `exercises.${exerciseIndex}.sets.${setIndex}.reps`,
            { valueAsNumber: true },
          )}
        />
      </td>

      {/* Load Prescription */}
      <td>
        <select
          className={`select select-sm flex-1 min-w-0 ${setError?.loadPrescription ? "select-error" : ""}`}
          {...control.register(
            `exercises.${exerciseIndex}.sets.${setIndex}.loadPrescription`,
          )}
        >
          <option value="Fixed">Fixed</option>
          <option value="Percentage">% Max</option>
          <option value="RPE">RPE</option>
        </select>
      </td>

      {/* Value Input */}
      <td>
        {loadPrescription === "Fixed" && (
          <input
            type="number"
            step="0.125"
            className={`input input-sm w-14 ${setError?.weight ? "input-error" : ""}`}
            placeholder="0"
            {...control.register(
              `exercises.${exerciseIndex}.sets.${setIndex}.weight`,
              { valueAsNumber: true },
            )}
          />
        )}
        {loadPrescription === "Percentage" && (
          <input
            type="number"
            className={`input input-sm w-14 ${setError?.percentageOfMax ? "input-error" : ""}`}
            placeholder="80"
            {...control.register(
              `exercises.${exerciseIndex}.sets.${setIndex}.percentageOfMax`,
              { valueAsNumber: true },
            )}
          />
        )}
        {loadPrescription === "RPE" && (
          <input
            type="number"
            min="1"
            max="10"
            step="0.5"
            className={`input input-sm w-14 ${setError?.rpe ? "input-error" : ""}`}
            placeholder="8"
            {...control.register(
              `exercises.${exerciseIndex}.sets.${setIndex}.rpe`,
              { valueAsNumber: true },
            )}
          />
        )}
      </td>

      {/* Remove Button */}
      <td>
        <button
          type="button"
          onClick={onRemove}
          className="btn btn-ghost btn-sm btn-circle shrink-0"
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
  );
};

export default function WorkoutTemplateForm() {
  const [exerciseModalIsOpen, setExerciseModalIsOpen] = useState(false);
  const { data, isError, isLoading } = useGetAllExerciseQuery();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(workoutTemplateSchema),
    defaultValues: {
      name: "",
      exercises: [],
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Template submitted:", data);
      alert("Template saved! Check console for data.");
      reset();
    } catch (error) {
      console.error("Error creating template:", error);
      setError("root", {
        type: "manual",
        message: "Failed to create template. Please try again.",
      });
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Create Workout Template</h2>

          <div className="space-y-6">
            {/* Root error */}
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

            {/* Template Name Field */}
            <div className="form-control w-full">
              <label htmlFor="name" className="label">
                <span className="label-text font-semibold">Template Name</span>
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                placeholder="e.g., Upper Body Day"
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

            {/* Exercises Section */}
            {fields.length > 0 && (
              <div className="space-y-4">
                <label className="label">
                  <span className="label-text font-semibold">Exercises</span>
                </label>
                {fields.map((field, index) => (
                  // TODO Hand over errors.exercises[index]
                  // Same for exercise sets
                  <ExerciseField
                    key={field.id}
                    index={index}
                    control={control}
                    exerciseName={field.name || ""}
                    exerciseError={errors.exercises?.[index]}
                    onRemove={() => remove(index)}
                  />
                ))}
              </div>
            )}

            {/* Add Exercise Button */}
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
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="btn btn-success w-full"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  "Create Template"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Selection Modal */}
      <ExerciseSelectModal
        exercises={data || []}
        isError={isError}
        isLoading={isLoading}
        isOpen={exerciseModalIsOpen}
        closeFunction={() => setExerciseModalIsOpen(false)}
        onSelect={(exerciseId) => {
          const exerciseName = data?.find(
            (exercise) => exercise.ID === exerciseId,
          )?.Name;
          append({
            exerciseId: exerciseId,
            name: exerciseName,
            sets: [{ loadPrescription: "Fixed" }],
          });
        }}
      />
    </div>
  );
}

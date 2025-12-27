import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAddUserWorkoutMutation } from "../../hooks/mutations/useUserWorkoutMutation";
import { useNavigate } from "@tanstack/react-router";

const formSchema = z.object({
  name: z.string().min(1).max(120).trim(),
  // TODO Allow for exercises and sets. Not required
});

type FormData = z.infer<typeof formSchema>;

export const AddUserWorkoutForm = () => {
  const navigate = useNavigate();
  const addWorkoutMutation = useAddUserWorkoutMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Todo create default name like. Workout [DATETIME]
      name: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await addWorkoutMutation.mutateAsync({ Name: data.name });

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

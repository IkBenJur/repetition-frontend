import { createFileRoute } from "@tanstack/react-router";
import z from "zod/v3";
import { getUserWorkoutQuery } from "../../../hooks/queries/useUserWorkouts";
import { UserWorkoutForm } from "../../../components/userWorkoutFormComponent";

export const Route = createFileRoute("/_auth/userWorkout/$userWorkoutId")({
  params: {
    parse: (params) => ({
      userWorkoutId: z.coerce.number().int().parse(params.userWorkoutId),
    }),
    stringify: ({ userWorkoutId }) => ({
      userWorkoutId: `${userWorkoutId}`,
    }),
  },
  loader: async ({ context, params: { userWorkoutId } }) => {
    return await context.queryClient.ensureQueryData(
      getUserWorkoutQuery(userWorkoutId),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const workout = Route.useLoaderData();
  return (
    <div className="container mx-auto p-6">
      {workout ? (
        <UserWorkoutForm userWorkout={workout} />
      ) : (
        <div>Workout not found</div>
      )}
    </div>
  );
}

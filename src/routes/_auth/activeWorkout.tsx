import { createFileRoute } from "@tanstack/react-router";
import {
  activeUserWorkoutQuery,
  useSuspenseActiveUserWorkout,
} from "../../hooks/queries/useUserWorkouts";
import { UserWorkoutForm } from "../../components/userWorkoutFormComponent";

export const Route = createFileRoute("/_auth/activeWorkout")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(activeUserWorkoutQuery());
  },
  pendingComponent: () => <div>Loading...</div>,
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseActiveUserWorkout();

  return (
    <div className="container mx-auto p-6">
      {data ? (
        <UserWorkoutForm userWorkout={data} />
      ) : (
        <div>No active workout</div>
      )}
    </div>
  );
}

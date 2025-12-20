import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  activeUserWorkoutQuery,
  useSuspenseActiveUserWorkout,
} from "../../hooks/queries/useUserWorkouts";
import { UserWorkoutForm } from "../../components/userWorkoutFormComponent";

export const Route = createFileRoute("/_auth/activeWorkout")({
  loader: ({ context, location }) => {
    if (context.userToken == null) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    context.queryClient.ensureQueryData(activeUserWorkoutQuery());
  },
  pendingComponent: () => <div>Loading...</div>,
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseActiveUserWorkout();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <UserWorkoutForm userWorkout={data} />
    </div>
  );
}

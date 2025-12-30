import { createFileRoute } from "@tanstack/react-router";
import { AddUserWorkoutForm } from "../../../components/userWorkout/addUserWorkoutForm";

export const Route = createFileRoute("/_auth/userWorkout/add-new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AddUserWorkoutForm />;
}

import { createFileRoute } from "@tanstack/react-router";
import WorkoutTemplateFormComponent from "../../../components/workout-template/workoutTemplateFormComponent";

export const Route = createFileRoute("/_auth/workout-template/add-new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <WorkoutTemplateFormComponent />;
}

import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { formatDate } from "date-fns";
import {
  activeUserWorkoutQuery,
  useSuspenseActiveUserWorkout,
} from "../../hooks/queries/useUserWorkouts";

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

    context.queryClient.ensureQueryData(
      activeUserWorkoutQuery(context.userToken),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const context = Route.useRouteContext();
  const { data } = useSuspenseActiveUserWorkout(context.userToken!);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{data.Name}</h1>
          <p className="text-base-content/60">
            {formatDate(new Date(data.DateStart), "d MMMM, yyyy")}
          </p>
        </div>

        <div className="space-y-4">
          {data.UserWorkoutExercises.map((exercise) => (
            <div key={exercise.ID} className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">
                  {exercise.ExerciseId}
                </h2>

                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <td>Set</td>
                        <td>Reps</td>
                        <td>Weight</td>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.UserWorkoutExerciseSets.map((set, index) => (
                        <tr key={index} className="hover">
                          <td className="font-semibold">{index + 1}</td>
                          <td>{set.Reps}</td>
                          <td>{set.Weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
}

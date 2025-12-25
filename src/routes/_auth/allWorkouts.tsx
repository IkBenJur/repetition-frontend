import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  allUserWorkoutsQuery,
  useSuspenseAllUserWorkoutsQuery,
} from "../../hooks/queries/useUserWorkouts";
import { formatDate } from "date-fns";
import { NavLink } from "../-components/nav-link";

export const Route = createFileRoute("/_auth/allWorkouts")({
  loader: ({ context, location }) => {
    if (context.userToken == null) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    context.queryClient.ensureQueryData(allUserWorkoutsQuery());
  },
  pendingComponent: () => <div>Loading...</div>,
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseAllUserWorkoutsQuery();
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-base-content">My Workouts</h1>
          <p className="text-base-content/60">
            Track your progress and consistency
          </p>
        </div>

        <button className="btn btn-primary btn-wide shadow-lg">
          {/*TODO ADD Handle add new*/}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
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
          Start New Workout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((workout) => (
          <div
            key={workout.ID}
            className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow border border-base-300"
          >
            <div className="card-body">
              <div className="flex justify-between items-start">
                <h2 className="card-title text-xl">{workout.Name}</h2>
                {workout.DateEnd && (
                  <div className="badge badge-success badge-outline">Done</div>
                )}
              </div>

              <p className="text-sm text-base-content/70">
                {formatDate(new Date(workout.DateStart), "PPP")}
              </p>

              <div className="card-actions justify-end mt-4">
                {/* TODO To specific link*/}
                <NavLink to={"/allWorkouts"} className="btn btn-ghost btn-sm">
                  View Details
                </NavLink>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {data.length === 0 && (
          <div className="col-span-full py-20 text-center bg-base-200/50 rounded-box border-2 border-dashed border-base-300">
            <p className="text-base-content/50">
              No workouts found. Time to hit the gym!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

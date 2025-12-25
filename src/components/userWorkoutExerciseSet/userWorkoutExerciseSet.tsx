import { useUpdateUserWorkoutExerciseSet } from "../../hooks/mutations/useUserWorkoutExerciseSetMutation";
import type { UserWorkoutExerciseSet } from "../../types/userWorkoutExerciseSet.types";

interface userWorkoutExerciseSetTableProps {
  userWorkoutExerciseSets: UserWorkoutExerciseSet[];
  canUpdateSets: boolean;
}

export const UserWorkoutExerciseSetTable = ({
  userWorkoutExerciseSets,
  canUpdateSets,
}: userWorkoutExerciseSetTableProps) => {
  const useUpdateExerciseWorkoutSet = useUpdateUserWorkoutExerciseSet();

  // TODO Currently we update on every change.
  // Limit the api calls.
  const handleUpdateWeightForSet = (
    exerciseSet: UserWorkoutExerciseSet,
    newWeight: string,
  ) => {
    useUpdateExerciseWorkoutSet.mutate({
      ...exerciseSet,
      Weight: parseFloat(newWeight) || 0,
    });
  };

  const handleUpdateRepsForSet = (
    exerciseSet: UserWorkoutExerciseSet,
    newReps: string,
  ) => {
    useUpdateExerciseWorkoutSet.mutate({
      ...exerciseSet,
      Reps: parseInt(newReps) || 0,
    });
  };

  const handleUpdateIsDoneForSet = (
    exerciseSet: UserWorkoutExerciseSet,
    newIsDone: boolean,
  ) => {
    useUpdateExerciseWorkoutSet.mutate({
      ...exerciseSet,
      IsDone: newIsDone,
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Set</th>
            <th>Reps</th>
            <th>Weight</th>
            <th>Done</th>
          </tr>
        </thead>
        <tbody>
          {userWorkoutExerciseSets.map((set) => (
            <tr key={set.ID}>
              <td className="font-semibold">{set.SetNumber}</td>
              <td>
                {canUpdateSets ? (
                  <input
                    type="number"
                    className={`input input-sm  w-20 ${set.IsDone ? "input-primary" : "text-gray-400"}`}
                    value={set.Reps ? set.Reps : ""}
                    onChange={(e) =>
                      handleUpdateRepsForSet(set, e.target.value)
                    }
                  />
                ) : (
                  set.Reps
                )}
              </td>
              <td>
                {canUpdateSets ? (
                  <input
                    type="number"
                    className={`input input-sm  w-20 ${set.IsDone ? "input-primary" : "text-gray-400"}`}
                    value={set.Weight ? set.Weight : ""}
                    onChange={(e) =>
                      handleUpdateWeightForSet(set, e.target.value)
                    }
                    step={0.25}
                  />
                ) : (
                  set.Weight
                )}
              </td>
              <td>
                {canUpdateSets ? (
                  <button
                    type="button"
                    onClick={() => handleUpdateIsDoneForSet(set, !set.IsDone)}
                    className="btn btn-ghost btn-sm btn-circle"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`w-6 h-6 ${
                        set.IsDone ? "text-primary" : "text-base-content/30"
                      }`}
                    >
                      <circle cx="12" cy="12" r="10" />
                      {set.IsDone && <path d="M9 12l2 2 4-4" />}
                    </svg>
                  </button>
                ) : (
                  <span
                    className={
                      set.IsDone ? "text-primary" : "text-base-content/30"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6"
                    >
                      <circle cx="12" cy="12" r="10" />
                      {set.IsDone && <path d="M9 12l2 2 4-4" />}
                    </svg>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

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

  return (
    <div className="overflow-x-auto">
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Set</th>
            <th>Reps</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {userWorkoutExerciseSets.map((set, index) => (
            <tr key={set.ID}>
              <td className="font-semibold">{index + 1}</td>
              <td>
                {canUpdateSets ? (
                  <input
                    type="number"
                    className="input input-sm input-primary w-20"
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
                    className="input input-sm input-primary w-20"
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

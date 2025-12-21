import { useState } from "react";
import type { Exercise } from "../../types/exercise.types";

interface exerciseSelectModalProps {
  isOpen: boolean;
  exercises: Exercise[];
  isError: boolean;
  isLoading: boolean;
  onSelect: (exerciseId: number, exerciseName: string) => void;
  closeFunction: () => void;
}

export const ExerciseSelectModal = ({
  isOpen,
  exercises,
  isError,
  isLoading,
  onSelect,
  closeFunction,
}: exerciseSelectModalProps) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
    null,
  );

  const selectedExerciseName =
    exercises.find((exercise) => exercise.ID === selectedExerciseId)?.Name ||
    "";

  const handleClose = () => {
    setSelectedExerciseId(null);
    closeFunction();
  };

  const handleSelect = () => {
    if (selectedExerciseId === null) return;
    onSelect(selectedExerciseId, selectedExerciseName);
    setSelectedExerciseId(null);
    closeFunction();
  };

  return (
    isOpen && (
      <div className="modal modal-open">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Select an Exercise</h3>

          {isError && (
            <div className="alert alert-error">
              <span>Failed to load exercises. Please try again.</span>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}

          {!isError && !isLoading && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {exercises.length == 0 ? (
                <div>No exercises found</div>
              ) : (
                exercises.map((exercise) => (
                  <div
                    key={exercise.ID}
                    className={`card bg-base-100 card-sm shadow-sm cursor-pointer m-2 rounded-xs ${
                      selectedExerciseId === exercise.ID
                        ? "ring-2 ring-primary"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedExerciseId(exercise.ID!)}
                  >
                    <div className="card-body bg-base-200">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="exercise-selection"
                          className="radio radio-primary"
                          checked={selectedExerciseId === exercise.ID}
                          onChange={() => setSelectedExerciseId(exercise.ID!)}
                        />
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold">{exercise.Name}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="modal-action">
            <button className="btn" onClick={handleClose}>
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSelect}
              disabled={selectedExerciseId === null}
            >
              Accept
            </button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={handleClose}></div>
      </div>
    )
  );
};

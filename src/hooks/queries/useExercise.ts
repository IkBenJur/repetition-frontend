import { useQuery } from "@tanstack/react-query";
import { exerciseService } from "../../services/exercise.service";

export const useGetAllExerciseQuery = () => {
  return useQuery({
    queryKey: ["exercise"],
    queryFn: exerciseService.getExercises,
  });
};

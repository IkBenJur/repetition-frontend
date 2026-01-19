import { useMutation } from "@tanstack/react-query";
import type { TemplateWorkout } from "../../types/templateWorkout.types";
import { templateService } from "../../services/template.service";

export const useAddWorkoutTemplateMutation = () => {
  return useMutation({
    mutationFn: (workoutTemplate: TemplateWorkout) =>
      templateService.saveWorkoutTemplate(workoutTemplate),
  });
};

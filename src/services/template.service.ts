import { getApiClient } from "../lib/apiClient";
import type { TemplateWorkout } from "../types/templateWorkout.types";

export const templateService = {
  getTemplateWorkout: async (id: number): Promise<TemplateWorkout> => {
    const apiClient = getApiClient();
    return apiClient.get(`/workout-template/${id}`);
  },

  getTemplateWorkouts: async (): Promise<TemplateWorkout[]> => {
    const apiClient = getApiClient();
    return apiClient.get(`/workout-template`);
  },

  saveWorkoutTemplate: async (
    workoutTemplate: TemplateWorkout,
  ): Promise<TemplateWorkout> => {
    const apiClient = getApiClient();
    return apiClient.post(`/workout-template`, workoutTemplate);
  },

  updateWorkoutTemplate: async (
    workoutTemplate: TemplateWorkout,
  ): Promise<TemplateWorkout> => {
    const apiClient = getApiClient();
    return apiClient.put(
      `/workout-template/${workoutTemplate.id}`,
      workoutTemplate,
    );
  },
};

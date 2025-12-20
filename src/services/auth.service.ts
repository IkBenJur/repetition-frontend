import { getApiClient } from "../lib/apiClient";
import type { LoginResponse } from "../types/auth.types";

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const api = getApiClient();
    return api.post("/login", { username, password });
  },
};

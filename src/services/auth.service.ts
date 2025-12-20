import { env } from "../lib/env";
import type { LoginResponse } from "../types/auth.types";

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${env.apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Login failed:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });

      throw new Error(
        `Login failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },
};

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { LoginCredentials, LoginResponse } from "../../types/auth.types";
import { authService } from "../../services/auth.service";

interface UseLoginFormat {
  onSucces: (token: string) => void;
  redirectTo: string;
}

export const useLoginMutation = ({ onSucces, redirectTo }: UseLoginFormat) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials.username, credentials.password),
    onSuccess: async (data: LoginResponse) => {
      // Call the login function from context
      onSucces(data.token);

      // Invalidate router
      await router.invalidate();

      // Navigate to redirect path
      router.navigate({ to: redirectTo });
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

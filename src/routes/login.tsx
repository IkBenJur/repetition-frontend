import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import { loginSchema } from "../types/auth.types";
import { useLoginMutation } from "../hooks/mutations/useAuthMutation";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  validateSearch: z.object({
    redirect: z.string().default("/"),
  }),
  beforeLoad: async ({ context, search }) => {
    const { isAuthenticated } = context;
    if (isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
  pendingComponent: () => <div>Loading...</div>,
});

function RouteComponent() {
  const { login } = Route.useRouteContext();
  const search = Route.useSearch();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const loginMutation = useLoginMutation({
    onSucces: login,
    redirectTo: search.redirect,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const result = loginSchema.safeParse({
      username: formData.get("username"),
      password: formData.get("password"),
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) {
          errors[field.toString()] = issue.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    loginMutation.mutate(result.data);
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold justify-center mb-4">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                name="username"
                autoFocus
                required
                className={`input input-bordered w-full ${
                  validationErrors.username ? "input-error" : ""
                }`}
              />
              {validationErrors.username && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationErrors.username}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                required
                className={`input input-bordered w-full ${
                  validationErrors.password ? "input-error" : ""
                }`}
              />
              {validationErrors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationErrors.password}
                  </span>
                </label>
              )}
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>

            {loginMutation.isError && (
              <div role="alert" className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{loginMutation.error.message}</span>
              </div>
            )}

            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="btn btn-primary w-full"
              >
                {loginMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <div className="text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <a href="/register" className="link link-primary">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

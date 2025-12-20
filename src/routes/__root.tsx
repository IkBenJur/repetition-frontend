import {
  Outlet,
  createRootRouteWithContext,
  useLocation,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

export type UserToken = string | null;

export type RouterContext = {
  queryClient: QueryClient;
  userToken: UserToken;
  isAuthenticated: boolean;
  login: (newUserToken: string) => void;
  logout: () => void;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated, logout } = Route.useRouteContext();
  const navigate = Route.useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-base-neutral">
      <header className="navbar bg-base-300 shadow-lg px-6">
        <div className="flex-1">
          <span className="text-2xl font-bold text-primary">Repetition</span>
        </div>
        <div className="flex-none">
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                navigate({ to: "/login", search: { redirect: location.href } });
              }}
              className="btn btn-primary"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => navigate({ to: "/login" })}
              className="btn btn-primary"
            >
              Login
            </button>
          )}
        </div>
      </header>

      <Outlet />
    </div>
  );
}

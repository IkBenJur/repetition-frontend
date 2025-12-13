import { Outlet, createRootRouteWithContext, useLocation } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { NavLink } from './-components/nav-link'

export type UserToken = string | null

export type RouterContext = {
  queryClient: QueryClient
  userToken: UserToken,
  isAuthenticated: boolean,
  login: (newUserToken: string) => void,
  logout: () => void
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent
})

function RootComponent() {
  const { isAuthenticated, logout } = Route.useRouteContext()
  const navigate = Route.useNavigate()
  const location = useLocation();

  return (
    <div className="min-h-screen bg-base-300">
      <header className="navbar bg-base-100 shadow-lg px-6">
        <div className="flex-1">
          <span className="text-2xl font-bold text-primary">Repetition</span>
        </div>
        <div className="flex-none">
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                navigate({ to: "/login", search: { redirect: location.href } })
              }}
              className="btn px-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => navigate({ to: "/login" })}
              className="btn px-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Login
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}

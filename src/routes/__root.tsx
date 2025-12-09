import * as React from 'react'
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
    <React.Fragment>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">

        <header className="absolute top-0 right-0 p-6">
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                navigate({ to: "/login", search: { redirect: location.href } })
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-blue-500/50"
            >
              Sign out
            </button>
          ) : (
            <NavLink
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-blue-500/50"
              to="/login">
              Login
            </NavLink>
          )}
        </header>

        <Outlet />

      </div>
    </React.Fragment>
  )
}

import * as React from 'react'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

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
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}

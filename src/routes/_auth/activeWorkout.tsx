import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { env } from '../../lib/env'
import { Suspense } from 'react'

const activeUserWorkoutQuery = (jwt: string) =>
  queryOptions({
    queryKey: ['activeUserWorkout', jwt],
    queryFn: () => fetch(
      `${env.apiUrl}/userWorkout/active`,
      { headers: { 'Authorization': jwt } }
    ).then((r) => r.json())
  })

export const Route = createFileRoute('/_auth/activeWorkout')({
  loader: ({ context, location }) => {
    if (context.userToken == null) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href
        }
      })
    }

    context.queryClient.ensureQueryData(activeUserWorkoutQuery(context.userToken))
  },
  component: RouteComponent
})

function RouteComponent() {
  const context = Route.useRouteContext()
  const { data } = useSuspenseQuery(activeUserWorkoutQuery(context.userToken!))

  return <Suspense fallback={<div>Loading...</div>}>
    {JSON.stringify(data)}
  </Suspense>
}

import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { env } from '../../lib/env'
import { Suspense } from 'react'
import { formatDate } from 'date-fns'

interface UserWorkoutExerciseSet {
  ID: number
  Reps: number
  Weight: number
}

interface UserWorkoutExercise {
  ID: number
  UserWorkoutId: number
  ExerciseId: number
  UserWorkoutExerciseSets: UserWorkoutExerciseSet[]
}

interface UserWorkout {
  ID: number
  Name: string
  DateStart: string
  UserWorkoutExercises: UserWorkoutExercise[]
}

const activeUserWorkoutQuery = (jwt: string) =>
  queryOptions({
    queryKey: ['activeUserWorkout', jwt],
    queryFn: async (): Promise<UserWorkout> => {
      const response = await fetch(`${env.apiUrl}/userWorkout/active`, { headers: { 'Authorization': jwt } })
      return response.json()
    }
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
    <div className='max-w-4xl max-auto p-6'>

      <div className='mb-8'>
        <h1 className='text-4xl font-bold mb-2'>{data.Name}</h1>
        <p className='text-base-content/60'>
          {formatDate(new Date(data.DateStart), 'd MMMM, yyyy')}
        </p>
      </div>

      <div className='space-y-4'>
        {data.UserWorkoutExercises.map((exercise) => (
          <div key={exercise.ID} className='card bg-base-200 shadow-md'>
            <div className='card-body'>
              <h2 className='card-title text-2xl mb-4'>{exercise.ExerciseId}</h2>

              <div className='overflow-x-auto'>
                <table className='table table-sm'>
                  <thead>
                    <tr>
                      <td>Set</td>
                      <td>Reps</td>
                      <td>Weight</td>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.UserWorkoutExerciseSets.map((set, index) => (
                      <tr key={index} className='hover'>
                        <td className='font-semibold'>{index + 1}</td>
                        <td>{set.Reps}</td>
                        <td>{set.Weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  </Suspense>
}

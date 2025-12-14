import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {

  const { isAuthenticated } = Route.useRouteContext()

  return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full">
          <div className="text-center">
            <h1 className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-600 mb-4">
              Repetition
            </h1>
            <div className="h-1 w-32 bg-linear-to-r from-blue-500 to-blue-700 mx-auto rounded-full"></div>
          </div>

          <div className="pb-6 text-center text-blue-300/60 text-sm mt-6">
            {isAuthenticated ? "Welcome back!" : "Please login to continue"}
          </div>
        </div>
      </div>
  )
}

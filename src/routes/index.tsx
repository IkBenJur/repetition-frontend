import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='bg-gray-800'>
      <h1 className="text-3xl text-red-800 font-bold underline">Repetition</h1>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main_layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div >IMAGE</div>
}

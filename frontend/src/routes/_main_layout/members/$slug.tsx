import { createFileRoute } from "@tanstack/react-router"
import { MemberDetail } from "@/components/main/MemberDetail"
import { team } from "@/lib/members"

export const Route = createFileRoute("/_main_layout/members/$slug")({
  component: MemberPage,
})

function MemberPage() {
  const { slug } = Route.useParams()

  const member = team.find((item) => item.slug === slug)

  if (!member) {
    return <div>Member not found</div>
  }

  return <MemberDetail member={member} />
}

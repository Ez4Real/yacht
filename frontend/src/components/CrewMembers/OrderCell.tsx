import { useEffect, useState } from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import type { CrewMemberPublic } from "@/client"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

interface OrderCellProps {
  member: CrewMemberPublic
  maxOrder: number
  onSubmit: (member: CrewMemberPublic, order: number) => void
  isPending: boolean
}

export function OrderCell({
  member,
  maxOrder,
  onSubmit,
  isPending,
}: OrderCellProps) {
  const [order, setOrder] = useState(String(member.order))

  useEffect(() => {
    setOrder(String(member.order))
  }, [member.order])

  const newOrder = Number(order)

  const hasChanged =
    Number.isInteger(newOrder) &&
    newOrder !== member.order

//   const handleSubmit = () => {
//     if (
//     !Number.isInteger(newOrder) ||
//     newOrder < 1 ||
//     newOrder > maxOrder ||
//     newOrder === member.order
//     ) {
//       return
//     }

//     onSubmit(member, newOrder)
//   }

  return (
    <div className="flex items-center gap-1">
      <InputGroup className="w-[60px]">
        <InputGroupInput
          type="number"
          min={1}
          max={maxOrder}
          value={order}
          onChange={(event) => setOrder(event.target.value)}
          disabled={isPending}
          className="
            min-w-0
            p-0!
            text-center
            text-xs
            [appearance:textfield]
            [&::-webkit-inner-spin-button]:appearance-none
            [&::-webkit-outer-spin-button]:appearance-none
          "
        />

        <InputGroupAddon
          align="inline-end"
          className="mr-0! w-4 flex-col gap-0 border-l p-0"
        >
          <InputGroupButton
            size="icon-xs"
            className="h-3.5 w-4 rounded-none"
            aria-label="Increment"
            disabled={isPending || newOrder >= maxOrder}
            onClick={() => setOrder(String(newOrder + 1))}
          >
            <ChevronUp className="size-3" />
          </InputGroupButton>

          <InputGroupButton
            size="icon-xs"
            className="h-3.5 w-4 rounded-none"
            aria-label="Decrement"
            disabled={isPending || newOrder <= 1}
            onClick={() => setOrder(String(newOrder - 1))}
          >
            <ChevronDown className="size-3" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {hasChanged && (
        <Button
          type="button"
          aria-label="Save order"
          disabled={isPending}
          onClick={() => onSubmit(member, newOrder)}
          className="p-[10px]"
        >
          <Check className="size-3.5" />
        </Button>
      )}
    </div>
  )
}
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

export default function Page() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Chyba 404</EmptyTitle>
        <EmptyDescription>
          Kde nic, tu nic. Vzduchoprázdno.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

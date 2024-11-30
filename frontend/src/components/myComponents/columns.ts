
import { ColumnDef } from "@tanstack/react-table"

export type Student = {
  id: string
  name: string
  created: string
}

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "created",
    header: "Created At",
  }
]
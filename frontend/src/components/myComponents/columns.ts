import { ColumnDef } from "@tanstack/react-table"

export interface Student {
  id: string;
  name: string;
  creationDate: string; 
}

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "creationDate", // Update this to match the field name
    header: "Created At",
    cell: info => new Date(info.getValue() as string).toLocaleString(), 
  }
]
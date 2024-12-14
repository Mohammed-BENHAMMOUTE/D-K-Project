import {ColumnDef} from "@tanstack/react-table"
import React from 'react'

export type Student = {
    name: string
    created: string
}

export const columns: ColumnDef<Student>[] = [
    {
        accessorKey: 'name',
        header: () => <div className="text-center">Name</div>
    },
    {
        accessorKey: 'created',
        header: () => <div className="text-center">Created</div>
    }
]

"use client"

import { X } from "lucide-react"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"

const statuses = [
    { value: 'Disponível', label: 'Disponível' },
    { value: 'Gestante', label: 'Gestante' },
    { value: 'Vendido', label: 'Vendido' },
];

const sexes = [
    { value: 'Macho', label: 'Macho' },
    { value: 'Fêmea', label: 'Fêmea' },
];


interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DogsTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between w-full flex-col md:flex-row gap-4">
      <div className="flex flex-1 items-center space-x-2 w-full flex-wrap gap-2">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("sex") && (
          <DataTableFacetedFilter
            column={table.getColumn("sex")}
            title="Sexo"
            options={sexes}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const copyToClipboard = () => {
    // Get headers
    const headers = table.getFlatHeaders().map(header => 
      header.column.columnDef.header as string || header.id
    );
    
    // Get data rows
    const rows = table.getRowModel().rows.map(row => {
      return row.getVisibleCells().map(cell => {
        const value = cell.getValue();
        return String(value ?? '');
      });
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows].map(row => row.join('\t')).join('\n');
    
    // Copy to clipboard
    navigator.clipboard.writeText(csvContent).then(() => {
      toast.success("Copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy");
    });
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={copyToClipboard}
        >
          <Copy className="h-4 w-4" />
          Copy to Clipboard
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
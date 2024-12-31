"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderWithProduct } from "@/lib/types";
import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown } from "lucide-react";
import BusinessOrderRefundForm from "@/components/business/BusinessOrderRefundForm";

type BusinessOrdersTableProps = {
  orders: OrderWithProduct[];
};

export default function BusinessOrdersTable({
  orders,
}: BusinessOrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const columns: ColumnDef<OrderWithProduct>[] = [
    {
      id: "createdAt",
      accessorFn: (row) => formatDate(row.createdAt),
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h4 2-4" />
          </Button>
        );
      },
    },
    {
      id: "name",
      accessorFn: (row) => row.product.name,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product
            <ArrowUpDown className="ml-2 h4 2-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <Button asChild variant="link">
            <Link
              href={`/business/${row.original.product.businessId}/products/${row.original.product.id}`}
            >
              {row.original.product.name}
            </Link>
          </Button>
        );
      },
    },
    {
      id: "price",
      accessorFn: (row) => formatCurrency(row.pricePaidInCents / 100),
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price paid
            <ArrowUpDown className="ml-2 h4 2-4" />
          </Button>
        );
      },
    },
    {
      id: "refundButton",
      header: "Issue Refund",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <>
            {order.refundedAt ? (
              `Refunded on ${formatDate(order.refundedAt)}`
            ) : (
              <BusinessOrderRefundForm order={order} />
            )}
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by product name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

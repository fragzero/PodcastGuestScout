import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";

interface DataTableColumn<T> {
  header: string;
  accessorKey: string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string) => void;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  emptyMessage = "No data available",
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-opacity-50 border-t-primary rounded-full" />
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const handleHeaderClick = (column: DataTableColumn<T>) => {
    if (column.sortable && onSort) {
      onSort(column.accessorKey);
    }
  };

  return (
    <div className="rounded-md border border-neutral-200 bg-white">
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.accessorKey}
                  className={column.sortable ? "cursor-pointer select-none" : ""}
                  onClick={() => handleHeaderClick(column)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && sortColumn === column.accessorKey && (
                      <span className="inline-flex">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, i) => (
              <TableRow
                key={i}
                className={onRowClick ? "cursor-pointer hover:bg-neutral-50" : ""}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell key={column.accessorKey}>
                    {column.cell
                      ? column.cell(item)
                      : (item as any)[column.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

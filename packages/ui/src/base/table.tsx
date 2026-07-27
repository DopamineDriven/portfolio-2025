"use client";

import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

function BaseTable({ className, ...props }: ComponentPropsWithRef<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function BaseTableHeader({
  className,
  ...props
}: ComponentPropsWithRef<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function BaseTableBody({
  className,
  ...props
}: ComponentPropsWithRef<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function BaseTableFooter({
  className,
  ...props
}: ComponentPropsWithRef<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function BaseTableRow({ className, ...props }: ComponentPropsWithRef<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  );
}

function BaseTableHead({ className, ...props }: ComponentPropsWithRef<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap has-[[role=checkbox]]:pr-0",
        className
      )}
      {...props}
    />
  );
}

function BaseTableCell({ className, ...props }: ComponentPropsWithRef<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0",
        className
      )}
      {...props}
    />
  );
}

function BaseTableCaption({
  className,
  ...props
}: ComponentPropsWithRef<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  BaseTable,
  BaseTableHeader,
  BaseTableBody,
  BaseTableFooter,
  BaseTableHead,
  BaseTableRow,
  BaseTableCell,
  BaseTableCaption
};

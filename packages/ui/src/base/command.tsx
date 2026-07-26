"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { Command as CommandPrimitive } from "cmdk";
import {
  BaseDialog,
  BaseDialogContent,
  BaseDialogDescription,
  BaseDialogHeader,
  BaseDialogTitle
} from "@/base/dialog";
import { BaseInputGroup, BaseInputGroupAddon } from "@/base/input-group";
import { Check } from "@/icons/check";
import { Search } from "@/icons/search";
import { cn } from "@/lib/utils";

function BaseCommand({
  className,
  ...props
}: ComponentPropsWithRef<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-popover text-popover-foreground flex size-full flex-col overflow-hidden rounded-xl! p-1",
        className
      )}
      {...props}
    />
  );
}

function BaseCommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<ComponentPropsWithRef<typeof BaseDialog>, "children"> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
  children: ReactNode;
}) {
  return (
    <BaseDialog {...props}>
      <BaseDialogHeader className="sr-only">
        <BaseDialogTitle>{title}</BaseDialogTitle>
        <BaseDialogDescription>{description}</BaseDialogDescription>
      </BaseDialogHeader>
      <BaseDialogContent
        className={cn(
          "top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0",
          className
        )}
        showCloseButton={showCloseButton}>
        {children}
      </BaseDialogContent>
    </BaseDialog>
  );
}

function BaseCommandInput({
  className,
  ...props
}: ComponentPropsWithRef<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="p-1 pb-0">
      <BaseInputGroup className="border-input/30 bg-input/30 h-8! rounded-lg! shadow-none! *:data-[slot=input-group-addon]:pl-2!">
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <BaseInputGroupAddon>
          <Search className="size-4 shrink-0 opacity-50" />
        </BaseInputGroupAddon>
      </BaseInputGroup>
    </div>
  );
}

function BaseCommandList({
  className,
  ...props
}: ComponentPropsWithRef<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
        className
      )}
      {...props}
    />
  );
}

function BaseCommandEmpty({
  className,
  ...props
}: ComponentPropsWithRef<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    />
  );
}

function BaseCommandGroup({
  className,
  ...props
}: ComponentPropsWithRef<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-foreground **:[[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium",
        className
      )}
      {...props}
    />
  );
}

function BaseCommandSeparator({
  className,
  ...props
}: ComponentPropsWithRef<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  );
}

function BaseCommandItem({
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item data-selected:bg-muted data-selected:text-foreground data-selected:*:[svg]:text-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}>
      {children}
      <Check className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item>
  );
}

function BaseCommandShortcut({
  className,
  ...props
}: ComponentPropsWithRef<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-muted-foreground group-data-selected/command-item:text-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  );
}

export {
  BaseCommand,
  BaseCommandDialog,
  BaseCommandInput,
  BaseCommandList,
  BaseCommandEmpty,
  BaseCommandGroup,
  BaseCommandItem,
  BaseCommandShortcut,
  BaseCommandSeparator
};

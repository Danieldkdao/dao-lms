"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CirclePlusIcon } from "lucide-react";
import Link from "next/link";

export function NavMain({
  items,
  includeCreate = true,
}: {
  includeCreate?: boolean;
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {includeCreate && (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <Link href="/admin/courses/create" className="w-full">
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="min-w-8 bg-primary cursor-pointer text-white duration-200 ease-linear hover:bg-primary/90 hover:text-white active:bg-primary/90 active:text-primary-foreground"
                >
                  <CirclePlusIcon />
                  <span>Quick Create</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

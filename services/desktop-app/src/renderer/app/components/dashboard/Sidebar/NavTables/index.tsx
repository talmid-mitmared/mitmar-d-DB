'use client';

import { MoreHorizontal } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../../../shared/ui/Sidebar';
import { MenuItem } from './MenuItem';

interface DatabaseTable {
  name: string;
  id: string;
}

const DB_TABLES: DatabaseTable[] = [
  {
    name: 'OS releated pdfs',
    id: '/',
  },
  {
    name: 'CS releated papers',
    id: '/',
  },
  {
    name: 'School class ppts',
    id: '/',
  },
];

export function NavTables() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="font-semibold">TABLES</SidebarGroupLabel>
      <SidebarMenu>
        {DB_TABLES.map((item) => (
          <MenuItem name={item.name} />
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

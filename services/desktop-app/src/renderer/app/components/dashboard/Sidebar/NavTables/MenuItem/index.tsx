import { MoreHorizontal, TableProperties } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger } from '../../../../../shared/ui/DropdownMenu';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../../../../shared/ui/Sidebar';
import { lazy } from 'react';

const LazyMenuItemPopup = lazy(() => import('./MenuItemPopup'));

export function MenuItem({ name }: { name: string }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a href={'/'}>
          <TableProperties />
          <span className="text-sm">{name}</span>
        </a>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <LazyMenuItemPopup />
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

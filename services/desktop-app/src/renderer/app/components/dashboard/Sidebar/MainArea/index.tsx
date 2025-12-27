import { Clock3, LayoutGrid, Star } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../../../shared/ui/Sidebar';

export function MainArea() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-semibold">MAIN</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={'All Documents'}>
            <LayoutGrid />
            <span>All Documents</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={'Recent Files'}>
            <Clock3 /> <span>Recent Files</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={'Favorites'}>
            <Star /> <span>Favorites </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '../../../shared/ui/Sidebar';
import { Header } from './Header';
import { NavTables } from './NavTables';

export function Sidebar() {
  return (
    <SidebarUI collapsible="icon">
      <SidebarHeader>
        <Header />
      </SidebarHeader>
      <SidebarContent>
        <NavTables />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </SidebarUI>
  );
}

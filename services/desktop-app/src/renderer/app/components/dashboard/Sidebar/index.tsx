import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '../../../shared/ui/Sidebar';
import { TablesArea } from './TablesArea';
import { DatabaseSwitcher } from './DatabaseSwitcher';
import { FilterArea } from './FilterArea';
import { MainArea } from './MainArea';
import { UserArea } from './UserArea';

const data = {
  user: {
    name: 'john does',
    email: 'johnDoe@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
};

export function Sidebar() {
  return (
    <SidebarUI collapsible="icon">
      <SidebarHeader className="group-data-[collapsible=icon]:p-0">
        <DatabaseSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <TablesArea />
        <MainArea />
        <FilterArea />
      </SidebarContent>
      <SidebarFooter>
        <UserArea user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </SidebarUI>
  );
}

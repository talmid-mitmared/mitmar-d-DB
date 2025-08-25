import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/Collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from './ui/Sidebar';

interface IProps {
  title: string;
  titleIcon: React.ReactNode;
  children: React.ReactNode;
  groupLabel?: string;
}

export function AbstractedSideBar({ title, titleIcon, children, groupLabel }: IProps) {
  return (
    <SidebarGroup>
      {groupLabel != null ? <SidebarGroupLabel>groupLabel</SidebarGroupLabel> : null}
      <SidebarMenu>
        <Collapsible asChild className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={title}>
                {titleIcon}
                <span>{title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>{children}</SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}

'use client';

import * as React from 'react';
import { BookOpen, Bot, Database, Settings2, SquareTerminal, TableProperties } from 'lucide-react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '../../shared/ui/Sidebar';
import { NavMain } from './NavMain';
import { NavUser } from './NavUser';
import { NavFileTypes } from './Sidebar/NavFileTypes';
import { DatabaseSwitcher } from './Sidebar/DatabaseSwitcher';
import { TablesArea } from './Sidebar/TablesArea';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Main',
      logo: Database,
      plan: '100 data exists',
    },
    {
      name: 'Second brain',
      logo: Database,
      plan: '120 data exists',
    },
    {
      name: 'Computer Science',
      logo: Database,
      plan: '50 data exists',
    },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'OS releated pdfs',
      url: '#',
      icon: TableProperties,
    },
    {
      name: 'CS releated papers',
      url: '#',
      icon: TableProperties,
    },
    {
      name: 'School class ppts',
      url: '#',
      icon: TableProperties,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <DatabaseSwitcher />
      <SidebarContent>
        <TablesArea />
        <NavMain items={data.navMain} />
        <NavFileTypes />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

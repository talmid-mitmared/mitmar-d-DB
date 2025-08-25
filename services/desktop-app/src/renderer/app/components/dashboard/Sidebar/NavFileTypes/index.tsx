import { ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../../shared/ui/Collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../../../../shared/ui/Sidebar';
import {
  RiFileExcelLine,
  RiFileLine,
  RiFileList2Line,
  RiFilePdfLine,
  RiFilePptLine,
  RiFileWordLine,
  RiImageLine,
} from 'react-icons/ri';

const FILE_LISTS = [
  {
    name: 'PDF files',
    url: '#',
    Component: () => <RiFilePdfLine className="!text-red-500" />,
  },
  {
    name: 'Word Documents',
    url: '#',
    Component: () => <RiFileWordLine className="!text-blue-500" />,
  },
  {
    name: 'Presentations',
    url: '#',
    Component: () => <RiFilePptLine className="!text-orange-500" />,
  },
  {
    name: 'Spreadsheets',
    url: '#',
    Component: () => <RiFileExcelLine className="!text-green-500" />,
  },
  {
    name: 'Images',
    url: '#',
    Component: () => <RiImageLine className="!text-purple-500" />,
  },
  {
    name: 'Other Files',
    url: '#',
    Component: () => <RiFileLine className="!text-gray-500" />,
  },
];

export function NavFileTypes() {
  const navTitle = 'File Types';

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible asChild className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={navTitle}>
                <RiFileList2Line />
                <span>{navTitle}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {FILE_LISTS.map((subItem, index) => (
                  <SidebarMenuSubItem key={index}>
                    <SidebarMenuSubButton asChild>
                      <a href={subItem.url}>
                        <subItem.Component />
                        <span>{subItem.name}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}

import { SidebarMenuSubButton, SidebarMenuSubItem } from '../../../../shared/ui/Sidebar';
import { FileItemButton } from './FileItemButton';

function SidebarMenuItemWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild>{children}</SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export function NavFileItems() {
  return (
    <>
      <SidebarMenuItemWrapper>
        <FileItemButton variant="PDF_FILES" />
      </SidebarMenuItemWrapper>

      <SidebarMenuItemWrapper>
        <FileItemButton variant="WORD_DOCUMENTS" />
      </SidebarMenuItemWrapper>

      <SidebarMenuItemWrapper>
        <FileItemButton variant="PRESENTATIONS" />
      </SidebarMenuItemWrapper>

      <SidebarMenuItemWrapper>
        <FileItemButton variant="SPREAD_SHEETS" />
      </SidebarMenuItemWrapper>

      <SidebarMenuItemWrapper>
        <FileItemButton variant="IMAGES" />
      </SidebarMenuItemWrapper>

      <SidebarMenuItemWrapper>
        <FileItemButton variant="OTHER_FILES" />
      </SidebarMenuItemWrapper>
    </>
  );
}

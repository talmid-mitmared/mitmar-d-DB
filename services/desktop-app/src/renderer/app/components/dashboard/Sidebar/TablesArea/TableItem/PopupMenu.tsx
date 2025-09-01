import { Folder, Forward, Trash2 } from 'lucide-react';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../../../../../shared/ui/DropdownMenu';
import { useSidebar } from '../../../../../shared/ui/Sidebar';

export default function PopupMenu() {
  const { isMobile } = useSidebar();

  return (
    <DropdownMenuContent
      className="w-48 rounded-lg"
      side={isMobile ? 'bottom' : 'right'}
      align={isMobile ? 'end' : 'start'}
    >
      <DropdownMenuItem>
        <Folder className="text-muted-foreground" />
        <span>View Project</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Forward className="text-muted-foreground" />
        <span>Share Project</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Trash2 className="text-muted-foreground" />
        <span>Delete Project</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

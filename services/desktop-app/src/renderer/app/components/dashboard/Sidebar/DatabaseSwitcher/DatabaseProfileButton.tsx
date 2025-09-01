import { RiDatabase2Fill, RiDatabase2Line } from 'react-icons/ri';
import { SidebarMenuButton } from '../../../../shared/ui/Sidebar';
import { ChevronsUpDown } from 'lucide-react';
import { Database } from '../types';

export function DatabaseProfileButton(props: Database) {
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      {props.type === 'MAIN' ? <DatabaseProfileButton.Main /> : <DatabaseProfileButton.Sub />}

      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{props.name}</span>
        <span className="truncate text-xs">{generateDataDesc(props.dataCount)}</span>
      </div>

      <ChevronsUpDown className="ml-auto" />
    </SidebarMenuButton>
  );
}

DatabaseProfileButton.Sub = () => {
  return (
    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg">
      <RiDatabase2Line className="size-5" />
    </div>
  );
};

DatabaseProfileButton.Main = () => {
  return (
    <div
      className="glass3d relative size-10 aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all hover:shadow-xl border border-white/30"
      style={{
        background:
          'linear-gradient(135deg, rgba(255,200,182,0.75) 0%, rgba(170,255,225,0.75) 50%, rgba(197,171,255,0.75) 100%)',
        backdropFilter: 'blur(32px) brightness(0.85) saturate(2.5)',
        WebkitBackdropFilter: 'blur(32px) brightness(0.85) saturate(2.5)',
      }}
    >
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] rotate-45 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-in-out hover:translate-x-1/2 hover:translate-y-1/2 pointer-events-none z-[2]" />
      <RiDatabase2Fill className="size-5 text-black drop-shadow-lg z-[6]" />
    </div>
  );
};

function generateDataDesc(count: number) {
  return `${count} file exists`;
}

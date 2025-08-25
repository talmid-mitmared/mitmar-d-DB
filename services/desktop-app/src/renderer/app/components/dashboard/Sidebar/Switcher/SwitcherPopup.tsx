'use client';

import { Plus } from 'lucide-react';

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../../../../shared/ui/DropdownMenu';
import { useSidebar } from '../../../../shared/ui/Sidebar';
import { Dispatch, SetStateAction } from 'react';
import { RiDatabase2Line } from 'react-icons/ri';

interface Database {
  name: string;
  dataCount: number;
}

export default function SwitcherPopup({
  databaseLists,
  setCurrentDB,
}: {
  databaseLists: Database[];
  setCurrentDB: Dispatch<SetStateAction<Database>>;
}) {
  const { isMobile } = useSidebar();

  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      align="start"
      side={isMobile ? 'bottom' : 'right'}
      sideOffset={4}
    >
      <DropdownMenuLabel className="text-muted-foreground text-xs">Teams</DropdownMenuLabel>
      {databaseLists.map((database, index) => (
        <SwitcherOptionItems database={database} key={index} setCurrentDB={setCurrentDB} />
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem className="gap-2 p-2">
        <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
          <Plus className="size-4" />
        </div>
        <div className="text-muted-foreground font-medium">Add team</div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

function SwitcherOptionItems({
  database,
  setCurrentDB,
}: {
  database: Database;
  setCurrentDB: Dispatch<SetStateAction<Database>>;
}) {
  return (
    <DropdownMenuItem onClick={() => setCurrentDB(database)} className="gap-2 p-2">
      <div className="flex size-6 items-center justify-center rounded-md border">
        <RiDatabase2Line className="size-3.5 shrink-0" />
      </div>
      {database.name}
    </DropdownMenuItem>
  );
}

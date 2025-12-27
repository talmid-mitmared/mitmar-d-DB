import { DropdownMenu, DropdownMenuTrigger } from '../../../../shared/ui/DropdownMenu';
import { DatabaseProfileButton } from './DatabaseProfileButton';
import { SidebarHeader } from '../../../../shared/ui/Sidebar';
import { useState, lazy } from 'react';
import { Database } from '../types';

const DatabaseProfileItems = lazy(() => import('./DatabaseProfileItems'));

/**
 * @resetmerlin
 * @todo: Has to integrate with the data
 */
const DATABASES: Database[] = [
  {
    name: 'All Documents',
    dataCount: 100,
    type: 'MAIN',
  },
  {
    name: 'Second brain',
    dataCount: 120,
    type: 'SUB',
  },
  {
    name: 'Computer Science',
    dataCount: 50,
    type: 'SUB',
  },
];

export function DatabaseSwitcher() {
  const [currentDB, setCurrentDB] = useState(DATABASES[0]);

  return (
    <SidebarHeader>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <DatabaseProfileButton {...currentDB} />
        </DropdownMenuTrigger>
        <DatabaseProfileItems databaseLists={DATABASES} setCurrentDB={setCurrentDB} />
      </DropdownMenu>
    </SidebarHeader>
  );
}

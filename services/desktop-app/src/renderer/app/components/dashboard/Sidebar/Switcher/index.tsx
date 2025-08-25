import { Database } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger } from '../../../../shared/ui/DropdownMenu';
import { SwitcherTrigger } from './SwitcherTrigger';
import { useState, lazy } from 'react';

const SwitcherPopup = lazy(() => import('./SwitcherPopup'));

export interface Database {
  name: string;
  dataCount: number;
  type: 'MAIN' | 'SUB';
}

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

export function Switcher() {
  const [currentDB, setCurrentDB] = useState(DATABASES[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <SwitcherTrigger {...currentDB} />
      </DropdownMenuTrigger>

      <SwitcherPopup databaseLists={DATABASES} setCurrentDB={setCurrentDB} />
    </DropdownMenu>
  );
}

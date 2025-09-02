import { RiFileList2Line } from 'react-icons/ri';
import { NavFileItems } from './Items';
import { AbstractedSideBar } from '../../../../shared/AbstractedSideBar';

export function FilterArea() {
  const TITLE = 'File Types' as const;

  return (
    <AbstractedSideBar title={TITLE} titleIcon={<RiFileList2Line />} groupLabel="FILTER">
      <NavFileItems />
    </AbstractedSideBar>
  );
}

import { RiFileList2Line } from 'react-icons/ri';
import { NavFileItems } from './Items';
import { AbstractedSideBar } from '../../../../shared/AbstractedSideBar';

export function NavFileTypes() {
  const TITLE = 'File Types' as const;

  return (
    <AbstractedSideBar title={TITLE} titleIcon={<RiFileList2Line />}>
      <NavFileItems />
    </AbstractedSideBar>
  );
}

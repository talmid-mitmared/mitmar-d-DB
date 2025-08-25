import { JSX } from 'react';
import {
  RiFileExcelLine,
  RiFileLine,
  RiFilePdfLine,
  RiFilePptLine,
  RiFileWordLine,
  RiImageLine,
} from 'react-icons/ri';

export const VARIANTS = {
  PDF_FILES: 'PDF_FILES',
  WORD_DOCUMENTS: 'WORD_DOCUMENTS',
  PRESENTATIONS: 'PRESENTATIONS',
  SPREAD_SHEETS: 'SPREAD_SHEETS',
  IMAGES: 'IMAGES',
  OTHER_FILES: 'OTHER_FILES',
} as const;

type FileItemsChildrenType = Record<FileItemVariants, { name: string; Icon: () => JSX.Element }>;

export const FILE_ITEM_CHILDREN: FileItemsChildrenType = {
  PDF_FILES: {
    name: 'PDF files',
    Icon: () => <RiFilePdfLine className="!text-red-500" />,
  },
  WORD_DOCUMENTS: {
    name: 'Word Documents',
    Icon: () => <RiFileWordLine className="!text-blue-500" />,
  },
  PRESENTATIONS: {
    name: 'Presentations',
    Icon: () => <RiFilePptLine className="!text-orange-500" />,
  },
  SPREAD_SHEETS: {
    name: 'Spreadsheets',
    Icon: () => <RiFileExcelLine className="!text-green-500" />,
  },
  IMAGES: {
    name: 'Images',
    Icon: () => <RiImageLine className="!text-purple-500" />,
  },
  OTHER_FILES: {
    name: 'Other Files',
    Icon: () => <RiFileLine className="!text-gray-500" />,
  },
} as const;

export type FileItemVariants = keyof typeof VARIANTS;

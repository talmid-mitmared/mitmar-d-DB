import { Button, ButtonProps } from '../../../../../shared/ui/Button';
import { FILE_ITEM_CHILDREN, FileItemVariants } from './variants';

interface FileItemButtonProps extends Omit<ButtonProps, 'variant'> {
  variant: FileItemVariants;
}

export const FileItemButton = ({ variant, ...props }: FileItemButtonProps) => {
  const Children = FILE_ITEM_CHILDREN[variant];

  return (
    <Button {...props} variant="ghost" className="w-full justify-start">
      <Children.Icon />
      <span>{Children.name}</span>
    </Button>
  );
};

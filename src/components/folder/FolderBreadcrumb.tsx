import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react';
import { PiCaretDown, PiTrash } from 'react-icons/pi';
import { useFolderDelete } from './folder.hooks';
import { handleErrors } from '@/core/utils';
import { useNotifications } from '@/core/useNotifications';

interface FolderBreadcrumbProps {
  folder: string;
  folderId: string;
}
const FolderBreadcrumb: React.FC<FolderBreadcrumbProps> = ({
  folder,
  folderId
}) => {
  const deleteFolder = useFolderDelete();
  const { success, error } = useNotifications();

  return (
    <Breadcrumbs variant="solid" className="mt-2" radius="full">
      <BreadcrumbItem onPress={() => (window.location.href = '/')}>
        Inicio
      </BreadcrumbItem>
      <BreadcrumbItem>
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="h-6 pr-2 text-small"
              endContent={<PiCaretDown className="text-default-500" />}
              radius="full"
              size="sm"
              variant="light"
            >
              {folder}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Routes">
            <DropdownItem
              startContent={
                <span className="text-danger-500">
                  <PiTrash />
                </span>
              }
              onPress={async () => {
                const confirm = window.confirm(
                  '¿Estás seguro de eliminar ésta carpeta?'
                );
                if (confirm) {
                  try {
                    await deleteFolder.mutateAsync(folderId);
                    success('Carpeta eliminada');
                    window.location.href = '/';
                  } catch (e) {
                    handleErrors(e, error);
                  }
                }
              }}
            >
              Eliminar Folder
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
};

export default FolderBreadcrumb;

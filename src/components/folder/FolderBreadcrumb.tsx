import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';

const FolderBreadcrumb = ({ folder }) => {
  return (
    <Breadcrumbs variant="solid" className="mt-2" radius="full">
      <BreadcrumbItem onPress={() => (window.location.href = '/')}>
        Inicio
      </BreadcrumbItem>
      <BreadcrumbItem>{folder}</BreadcrumbItem>
    </Breadcrumbs>
  );
};

export default FolderBreadcrumb;

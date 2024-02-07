import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';

export interface FolderDto extends BaseDto {
  name: string;
  parent: string;
}

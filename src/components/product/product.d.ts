import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';

export interface TVCProductInventoryDto extends BaseDto {
  name: string;
  quantity: string;
  warehouseId: string;
}

export interface TVCProductDto extends BaseDto {
  // list visible fields:
  name: string;
  tvcModel: string;
  listPrice: string;
  distributorPrice: string;
  brand: string;
  mediaMainImage: string;
  category: string;
  providerModel: string;
  inventory: TVCProductInventoryDto[];

  type: string;
  brandId: number;
  stageId: number;
  stageName: string;
  boxWeight: string;
  pieceHeight: string;
  productFlowType: string;
  satKey: string;
  piecesPerBox: number;
  boxLength: string;
  mediaGallery: string[];
  pieceWeight: string;
  tvcId: number;
  boxHeight: string;
  mediaVideos: string[];
  mediaDocuments: string[];
  breadcrumb: string;
  breadcrumbTree: string;
  pieceLength: string;
  raw: string;
  pieceWidth: string;
  boxWidth: string;
  categoryId: number;
  overviews: string;
}

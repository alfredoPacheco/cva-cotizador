import { useProductImages } from '@/components/product/product.hooks';
import { Image } from '@nextui-org/react';
import React from 'react';
import type { QuotationItemDto } from './quotationItem';

interface QuotationItemImagesProps {
  item: QuotationItemDto;
}
const QuotationItemImages: React.FC<QuotationItemImagesProps> = ({ item }) => {
  const { data } = useProductImages(item.providerId);

  return (
    <div className="flex flex-row">
      {data?.map((image, index) => (
        <Image key={index} src={image} width={100} height={100} />
      ))}
    </div>
  );
};

export default QuotationItemImages;

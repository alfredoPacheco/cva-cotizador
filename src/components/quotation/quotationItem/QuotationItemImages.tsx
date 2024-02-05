import { useProductImages } from '@/components/product/product.hooks';
import { Image } from '@nextui-org/react';
import React from 'react';
import type { QuotationItemDto } from './quotationItem';
import { Field } from '@/ui/Inputs';

interface QuotationItemImagesProps {
  item: QuotationItemDto;
}
const QuotationItemImages: React.FC<QuotationItemImagesProps> = ({ item }) => {
  const { data } = useProductImages(item.providerId);

  if (!data?.length) return null;

  return (
    <Field label="Imagen(es)">
      <div className="flex flex-row gap-2">
        {data?.map((image, index) => (
          <Image
            key={index}
            src={image}
            width={100}
            style={{ objectFit: 'contain' }}
            shadow="md"
            height="auto"
            removeWrapper
          />
        ))}
      </div>
    </Field>
  );
};

export default QuotationItemImages;

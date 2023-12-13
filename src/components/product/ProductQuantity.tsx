import { Button, Input } from '@nextui-org/react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import type { ProductsSelectionCount } from './ProductList';

interface ProductQuantityProps {
  form: UseFormReturn<ProductsSelectionCount>;
  id: string;
}
const ProductQuantity: React.FC<ProductQuantityProps> = ({ form, id }) => {
  const handleQuantityChange = (value: number) => {
    const quantity = Number(form.getValues(id) || 0);
    form.setValue(id, quantity + Number(value));
  };

  return (
    <div className="flex flex-row">
      <Controller
        name={id}
        control={form.control}
        render={({ field: { value, onChange } }) => (
          <Input
            value={String(value || 0)}
            onChange={onChange}
            type="text"
            min={0}
            size="sm"
            className="w-32"
            classNames={{
              inputWrapper: 'px-1 py-2 h-7 min-h-unit-1 bg-white/10',
              input: 'text-center'
            }}
            startContent={
              <Button
                className="text-sm min-w-0 w-0 px-3 h-6"
                size="sm"
                onPress={() => handleQuantityChange(-1)}
              >
                <span className="text-sm">-</span>
              </Button>
            }
            endContent={
              <Button
                className="text-sm min-w-0 w-0 px-3 h-6"
                size="sm"
                onPress={() => handleQuantityChange(+1)}
              >
                <span className="text-sm">+</span>
              </Button>
            }
          />
        )}
      />
    </div>
  );
};

export default ProductQuantity;

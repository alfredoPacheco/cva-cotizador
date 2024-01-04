import { parseContacts } from '@/components/quotation/quotation.hooks';
import type { ContactDto } from '@/types';
import { Avatar, Chip, Select, SelectItem } from '@nextui-org/react';
import { Controller } from 'react-hook-form';

interface ContactsSelectorProps {
  control: any;
  name: string;
  contacts: ContactDto[] | string[];
  label?: string;
}

const ContactsSelector: React.FC<ContactsSelectorProps> = ({
  control,
  name,
  contacts,
  label
}) => {
  const parsedContacts = parseContacts(contacts);
  return (
    <Controller
      name={name}
      control={control}
      // rules={{ ...rules, required }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error, isDirty }
      }) => (
        <Select
          selectedKeys={value || []}
          onSelectionChange={(keys: Set<any>) => {
            const keysArray = Array.from(keys);
            onChange(keysArray);
          }}
          items={parsedContacts}
          label={label}
          variant="bordered"
          isMultiline={true}
          selectionMode="multiple"
          placeholder="Select a contact"
          labelPlacement="outside"
          classNames={{
            // base: 'max-w-xs',
            trigger: 'min-h-unit-12 py-2'
          }}
          renderValue={items => {
            return (
              <div className="flex flex-wrap gap-2">
                {items.map(item => (
                  <Chip key={item.key}>{item.data.email}</Chip>
                ))}
              </div>
            );
          }}
        >
          {contact => (
            <SelectItem key={contact.email} textValue={contact.email}>
              <div className="flex gap-2 items-center">
                <Avatar
                  alt={contact.email}
                  className="flex-shrink-0"
                  size="sm"
                  src={contact.avatarHref}
                />
                <div className="flex flex-col">
                  <span className="text-small">{contact.email}</span>
                  {/* <span className="text-tiny text-default-400">
                    {contact.email}
                  </span> */}
                </div>
              </div>
            </SelectItem>
          )}
        </Select>
      )}
    />
  );
};

export default ContactsSelector;

import { account } from '@/core/appwriteClient';
import {
  Chip,
  Input,
  Textarea,
  type InputProps,
  Autocomplete as AutocompleteNextUI,
  AutocompleteItem,
  Checkbox as CheckboxNextUI
} from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Controller, type Control } from 'react-hook-form';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { GoSearch } from 'react-icons/go';
import useConfirmDialog from '../Dialog/useConfirmDialog';
import { useNotifications } from '@/core/useNotifications';
import { handleErrors } from '@/core/utils';
import Tiptap from '../Tiptap';

interface TextInputProps extends InputProps {
  control: Control<any>;
  name: string;
  rules?: any;
  // label?: string;
  // placeholder?: string;
  required?: boolean;
  // disabled?: boolean;
  mt?: number;
  mb?: number;
  h?: number;
  w?: number | string;
  customMessage?: string;
  focus?: boolean;
  big?: boolean;
  rows?: number;
  // type?:
  //   | 'text'
  //   | 'search'
  //   | 'url'
  //   | 'tel'
  //   | 'email'
  //   | 'password'
  //   | (string & {});
  endContent?: React.ReactNode;
  color?:
    | 'primary'
    | 'default'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  inputWrapper?: string;
  textAlign?: 'left' | 'center' | 'right';
  //   left?: string;
  //   right?: string;
  //   rightProps?: any;
  //   dense?: boolean;
  //   autoCorrect?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  control,
  name,
  rules = {},
  mt,
  mb,
  customMessage,
  focus,
  color = 'default',
  type = 'text',
  w = '100%',
  required = false,
  big = false,
  h,
  rows = 0,
  variant = 'bordered',
  inputWrapper = '',
  textAlign = 'left',
  ...props
  // label,
  // placeholder,
  // disabled,
  // endContent,
}) => {
  //   const theme = useTheme();

  // const inputWrapper = [];
  // if (big) {
  //   inputWrapper.push('px-5', 'h-20', 'rounded-xl');
  // }
  // if (h) {
  //   inputWrapper.push('h-' + h);
  // }

  const InputComponent = rows > 0 ? Textarea : Input;

  return (
    <Controller
      control={control}
      rules={{ ...rules, required }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error, isDirty }
      }) => (
        <div className="w-full p-0" style={{ maxWidth: w }}>
          <InputComponent
            // {...props}
            // rows={rows || 1}
            minRows={rows || 1}
            placeholder={props.placeholder}
            onBlur={onBlur}
            onChange={onChange}
            type={type}
            // variant={isDirty ? 'flat' : variant}
            variant={variant}
            // color={isDirty ? 'warning' : color}
            value={value || ''}
            label={props.label}
            autoFocus={focus}
            autoCapitalize="none"
            isRequired={required}
            // dense={dense}
            disabled={props.disabled}
            // left={left ? <TextInputPaper.Icon icon={left} /> : null}
            // right={
            //   right ? (
            //     <TextInputPaper.Icon icon={right} {...rightProps} />
            //   ) : null
            // }
            width="100%"
            fullWidth
            style={{
              // backgroundColor: theme.colors.tertiary,
              marginTop: mt,
              marginBottom: mb,
              textAlign
            }}
            isInvalid={!!error}
            errorMessage={customMessage || error?.message}
            endContent={props.endContent}
            min={props.min}
            step="any"
            readOnly={props.readOnly}
            classNames={{
              inputWrapper
            }}
          />
        </div>
      )}
      name={name}
    />
  );
};

interface EmailInputProps extends Partial<TextInputProps> {
  control: Control<any>;
  emailVerification?: boolean;
}
export const EmailInput: React.FC<EmailInputProps> = ({
  name = 'email',
  label = 'Email',
  emailVerification,
  ...props
}) => {
  const [emailSent, setEmailSent] = useState(false);
  const { Confirm, openConfirm } = useConfirmDialog();
  const { success, error } = useNotifications();
  const verifyEmailMutation = useMutation({
    mutationFn: () => {
      const verifyUrl = new URL('/verify', window.location.origin);
      return account.createVerification(verifyUrl.toString());
    }
  });
  const handleVerifyEmail = async () => {
    try {
      await openConfirm('Se enviará un correo para su validación');
      await verifyEmailMutation.mutateAsync();
      setEmailSent(true);
      success('Email de verificación enviado');
    } catch (e: any) {
      if (e?.feedback === 'cancel') {
        return;
      }
      handleErrors(e, error);
    }
  };
  return (
    <TextInput
      {...props}
      type="email"
      label={label}
      name={name}
      endContent={
        <div>
          <Confirm />
          {emailVerification ? (
            <Chip color="success" size="sm">
              Verificado
            </Chip>
          ) : (
            <Chip
              color="danger"
              className="cursor-pointer"
              size="sm"
              onClick={handleVerifyEmail}
            >
              Sin verificar
            </Chip>
          )}
        </div>
      }
    />
  );
};

interface PhoneInputProps extends Partial<TextInputProps> {
  control: Control<any>;
  phoneVerification?: boolean;
  requiresVerification: boolean;
}
export const PhoneInput: React.FC<PhoneInputProps> = ({
  name = 'phone',
  label = 'Phone',
  phoneVerification,
  requiresVerification = false,
  ...props
}) => {
  const [smsSent, setSmsSent] = useState(false);
  const { openConfirm } = useConfirmDialog();
  const { success, error } = useNotifications();

  const verifyPhoneMutation = useMutation({
    mutationFn: () => {
      return account.createPhoneVerification();
    }
  });

  const handleVerifyPhone = async () => {
    try {
      await openConfirm('Se enviará un mensaje SMS para su validación');
      await verifyPhoneMutation.mutateAsync();
      setSmsSent(true);
      success('SMS de verificación enviado');
    } catch (e: any) {
      if (e?.feedback === 'cancel') {
        return;
      }
      handleErrors(e, error);
    }
  };
  return (
    <TextInput
      {...props}
      type="tel"
      label={label}
      name={name}
      endContent={
        requiresVerification ? (
          <div>
            {phoneVerification ? (
              <Chip color="success" size="sm">
                Verificado
              </Chip>
            ) : (
              <Chip
                color="danger"
                className="cursor-pointer"
                size="sm"
                onClick={handleVerifyPhone}
              >
                Sin verificar
              </Chip>
            )}
          </div>
        ) : null
      }
    />
  );
};

interface PasswordInputProps extends Partial<TextInputProps> {
  control: Control<any>;
}
export const PasswordInput: React.FC<PasswordInputProps> = ({
  name = 'password',
  label = 'Password',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <TextInput
      {...props}
      label={label}
      name={name}
      endContent={
        <button type="button" onClick={toggleVisibility}>
          {isVisible ? (
            <span className="text-2xl text-default-400 pointer-events-none">
              <PiEyeBold />
            </span>
          ) : (
            <span className="text-2xl text-default-400 pointer-events-none">
              <PiEyeClosedBold />
            </span>
          )}
        </button>
      }
      type={isVisible ? 'text' : 'password'}
    />
  );
};

export const SearchInput: React.FC<TextInputProps> = props => {
  return (
    <TextInput
      {...props}
      type="search"
      placeholder="Buscar"
      w={300}
      classNames={{ inputWrapper: ['h-14', 'rounded-xl', 'px-4'] }}
      endContent={
        <span className="text-xl text-default-400 pointer-events-none">
          <GoSearch />
        </span>
      }
    />
  );
};

export const FormTextInput: React.FC<TextInputProps> = ({
  control,
  name,
  rules = {},
  mt = 0,
  mb = 0,
  customMessage = '',
  focus = false,
  color = 'default',
  type = 'text',
  w = '100%',
  textAlign = 'left',
  required = false,
  ...props
}) => {
  return (
    <Controller
      control={control}
      rules={{ ...rules, required }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error, isDirty }
      }) => (
        <div className="w-full p-0" style={{ maxWidth: w }}>
          <Input
            // {...props}
            className="h-2"
            size="sm"
            classNames={{
              // base: 'h-2 border-1 border-red-500',
              inputWrapper: 'h-8 min-h-5'
              // mainWrapper: 'h-2',
              // innerWrapper: 'h-2 !p-0',
              // input: 'h-2'
            }}
            placeholder={props.placeholder}
            onBlur={onBlur}
            onChange={onChange}
            type={type}
            variant={isDirty ? 'flat' : 'bordered'}
            color={isDirty ? 'warning' : color}
            value={value || ''}
            label={props.label}
            autoFocus={focus}
            autoCapitalize="none"
            isRequired={required}
            // dense={dense}
            readOnly={props.readOnly}
            disabled={props.disabled}
            // left={left ? <TextInputPaper.Icon icon={left} /> : null}
            // right={
            //   right ? (
            //     <TextInputPaper.Icon icon={right} {...rightProps} />
            //   ) : null
            // }
            width="100%"
            style={{
              // backgroundColor: theme.colors.tertiary,
              marginTop: mt,
              marginBottom: mb,
              textAlign
            }}
            isInvalid={!!error}
            errorMessage={customMessage || error?.message}
            startContent={props.startContent}
            endContent={props.endContent}
            min={props.min}
            step="any"
          />
        </div>
      )}
      name={name}
    />
  );
};

export const FormLabel = ({ children, size, className = '' }) => {
  return (
    <label
      className={`text-default-600 text-${size} font-semibold ${className}`}
    >
      {children}
    </label>
  );
};

interface FieldProps {
  label: string;
  children: React.ReactNode;
  className?: string | undefined;
  size?: string;
  style?: React.CSSProperties;
  labelClassName?: string;
}

export const Field: React.FC<FieldProps> = props => {
  return (
    <div
      className={'flex flex-col ' + (props.className || '')}
      style={props.style}
    >
      <FormLabel size={props.size} className={props.labelClassName || ''}>
        {props.label}
      </FormLabel>
      <div className="flex flex-row whitespace-nowrap">{props.children}</div>
    </div>
  );
};

export const ReadonlyField = ({
  control,
  name,
  w = '100%',
  required = false,
  fontSize = 'sm',
  format = (v: any) => v
}) => {
  return (
    <Controller
      control={control}
      rules={{ required }}
      render={({ field: { value } }) => (
        <div className="w-full p-0" style={{ maxWidth: w }}>
          <p className={`text-${fontSize} min-h-unit-5`}>{format(value)}</p>
        </div>
      )}
      name={name}
    />
  );
};

interface AutocompleteeProps {
  name: string;
  control: any;
  items: any[];
  labelProp?: string;
  secondaryLabelProp?: string;
  ariaLabel?: string;
  placeholder?: string;
  children?: React.ReactNode;
}
export const Autocomplete: React.FC<AutocompleteeProps> = props => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      // rules={{ ...rules, required }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error, isDirty }
      }) => (
        <AutocompleteNextUI
          // defaultItems={props.items || []}
          items={props.items || []}
          variant="underlined"
          aria-label={props.ariaLabel || 'Autocomplete'}
          // label="Cliente"
          fullWidth
          placeholder={props.placeholder || ''}
          labelPlacement="inside"
          // className="max-w-xs"
          // selectedKey={data.customer?.$id}
          value={value || null}
          selectedKey={value || null}
          onSelectionChange={key => {
            onChange(key);
          }}
        >
          {item => (
            <AutocompleteItem key={item.$id} textValue={item[props.labelProp]}>
              <div className="flex gap-2 items-center">
                {/* <Avatar
          alt={item.name}
          className="flex-shrink-0"
          size="sm"
          // src={item.avatar}
        /> */}
                <div className="flex flex-col">
                  <span className="text-md">{item[props.labelProp]}</span>
                  <span className="text-md text-default-400">
                    {item[props.secondaryLabelProp]}
                  </span>
                </div>
              </div>
            </AutocompleteItem>
          )}
        </AutocompleteNextUI>
      )}
    />
  );
};

export const RichTextEditor = ({ control, name, toolbar = false }) => {
  return (
    <Controller
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error, isDirty }
      }) => <Tiptap value={value} onChange={onChange} toolbar={toolbar} />}
      name={name}
    />
  );
};

export const TextArea = ({ control, name }) => {
  return (
    <Controller
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error, isDirty }
      }) => (
        <Textarea
          value={value || ''}
          variant="flat"
          classNames={{
            inputWrapper: 'bg-transparent'
          }}
          onChange={onChange}
        />
      )}
      name={name}
    />
  );
};

interface CheckboxProps {
  control: Control<any>;
  name: string;
  mt?: number;
  mb?: number;
  customMessage?: string;
  children?: React.ReactNode;
  focus?: boolean;
  width?: string | number;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  control,
  name,
  mt,
  mb,
  customMessage,
  focus,
  width = '100%',
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error }
      }) => (
        <CheckboxNextUI
          isSelected={value || false}
          onValueChange={onChange}
          radius="full"
          size="md"
          style={{
            marginTop: mt,
            marginBottom: mb,
            maxWidth: width
          }}
        >
          {props.children}
        </CheckboxNextUI>
      )}
    />
  );
};

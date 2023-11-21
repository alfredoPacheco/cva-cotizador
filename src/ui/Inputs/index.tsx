import { account } from '@/core/appwriteClient';
import { Chip, Input, Textarea, type InputProps } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Controller, type Control } from 'react-hook-form';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { GoSearch } from 'react-icons/go';
import useConfirmDialog from '../Dialog/useConfirmDialog';
import { useNotifications } from '@/core/useNotifications';
import { handleErrors } from '@/core/utils';

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
        fieldState: { error }
      }) => (
        <div className="w-full p-0" style={{ maxWidth: w }}>
          <InputComponent
            {...props}
            rows={rows || 1}
            minRows={rows || 1}
            placeholder={props.placeholder}
            onBlur={onBlur}
            onChange={onChange}
            type={type}
            variant={variant}
            color={color}
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
            style={{
              //   backgroundColor: theme.colors.tertiary,
              marginTop: mt,
              marginBottom: mb
            }}
            errorMessage={customMessage || error?.message}
            endContent={props.endContent}
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
      const verifyUrl = new URL('/profile', window.location.origin);
      return account.createVerification(verifyUrl.toString());
    }
  });
  const handleVerifyEmail = async () => {
    try {
      await openConfirm('Se enviará un correo para su validación');
      await verifyEmailMutation.mutateAsync();
      setEmailSent(true);
      success('Email de verificación enviado');
    } catch (e) {
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
  const { Confirm, openConfirm } = useConfirmDialog();
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
    } catch (e) {
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
      w={200}
      classNames={{ inputWrapper: ['h-14', 'rounded-xl', 'px-4'] }}
      endContent={
        <span className="text-xl text-default-400 pointer-events-none">
          <GoSearch />
        </span>
      }
    />
  );
};

export const FormLabel = ({ children }) => {
  return (
    <label className="text-default-600 text-sm font-semibold">{children}</label>
  );
};

interface FieldProps {
  label: string;
  children: React.ReactNode;
  className?: string | undefined;
}

export const Field: React.FC<FieldProps> = props => {
  return (
    <div className={'flex flex-col ' + props.className}>
      <FormLabel>{props.label}</FormLabel>
      {props.children}
    </div>
  );
};

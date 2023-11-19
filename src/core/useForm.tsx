import { useForm as useReactHookForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

interface useFormProps<T> {
  schema?: any;
  load?: any;
}

function useForm<T>(props?: useFormProps<T>) {
  const {
    setValue,
    getValues,
    control,
    handleSubmit,
    watch,
    reset,
    formState
  } = useReactHookForm<T>({
    resolver: props?.schema ? joiResolver(props.schema) : undefined,
    defaultValues: props?.load || {}
  });

  const setVal = setValue;
  const getVal = getValues;
  const { isValid, isDirty, dirtyFields, errors, isSubmitSuccessful } =
    formState;

  return {
    getVal,
    setVal,
    control,
    handleSubmit,
    watch,
    isValid,
    isDirty,
    isSubmitSuccessful,
    dirtyFields,
    errors,
    reset,
    formState
  };
}

export default useForm;

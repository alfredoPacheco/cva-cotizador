import { Field, RichTextEditor, TextInput } from '@/ui/Inputs';
import { useForm } from 'react-hook-form';
import { useSendEmail } from './email.hooks';
import type { EmailDto } from './email';
import { useNotifications } from '@/core/useNotifications';
import { handleErrors } from '@/core/utils';
import type { DialogWidget } from '@/ui/Dialog';
import type { ContactDto } from '@/types';
import {
  parseContacts,
  useQuotationSingle
} from '@/components/quotation/quotation.hooks';
import { useGlobalLoader } from '@/ui/GlobalLoader';
import { authCentralState } from '@/core/AuthCentralService';
import type { CustomerDto } from '@/components/customer/customer';

const FormField = ({ label, name, control, rows = 0, ...props }) => {
  return (
    <Field label={label}>
      <TextInput
        control={control}
        name={name}
        variant="underlined"
        classNames={{
          inputWrapper: ['!px-0']
        }}
        {...props}
      />
    </Field>
  );
};

const baseUrl = 'https://cva-cotizador.vercel.app';

interface EmailFormProps {
  id: string;
  dialog?: DialogWidget;
  quotationId?: string;
  contacts?: ContactDto[] | string[];
}

const EmailForm: React.FC<EmailFormProps> = ({ id, dialog, quotationId }) => {
  const { success, error } = useNotifications();
  const { data: quotation } = useQuotationSingle(quotationId, !!quotationId);
  const { control, getValues } = useForm<EmailDto>({
    values: {
      body: `<p>
        Estimado(a) <strong>${
          (quotation?.customer as CustomerDto)?.name
        }</strong>:
      </p>
      <p>
        En la siguiente liga podrá encontrar la cotización que nos solicitó:
      </p>
      <a href="${baseUrl}/reports/quotations/${quotationId}.pdf" target="_blank">Cotización</a>
      <p>
        Quedamos atentos a sus comentarios.
      </p>
      <p>
        Saludos,
      </p>
      <p>
        ${authCentralState.account.value.name}
      </p>`
    }
  });

  console.log('email quotation', quotation);

  const suscribers = parseContacts(quotation?.suscribers);
  console.log('suscribers', suscribers);

  const allContacts = [quotation.customer as ContactDto, ...suscribers];
  console.log('allContacts', allContacts);

  const { setLoading } = useGlobalLoader();

  const sendEmail = useSendEmail();

  const onSendEmail = async (s: string) => {
    try {
      setLoading(true);
      const data = getValues();
      data.quotationId = quotationId;
      data.sentBy = authCentralState.account.value.$id;
      if (data.to) {
        data.to =
          (data.to as string)
            .split(';')
            .map(to => ({ email: to } as ContactDto)) || '';
      }
      if (data.cc) {
        data.cc =
          (data.cc as string)
            .split(';')
            .map(cc => ({ email: cc } as ContactDto)) || '';
      }
      if (data.bcc) {
        data.bcc =
          (data.bcc as string)
            .split(';')
            .map(bcc => ({ email: bcc } as ContactDto)) || '';
      }
      // console.log('data', data);
      await sendEmail.mutateAsync(data);
      success('Email enviado');
      dialog?.close();
    } catch (err) {
      handleErrors(err, error, {
        'No Recipients provided': 'Se debe agregar al menos un destinatario.',
        'No subject provided': 'Se debe agregar un título.',
        'No body provided': 'Se debe agregar un cuerpo.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (dialog) {
    dialog.onOk = onSendEmail;
  }

  return (
    <div className="flex flex-col gap-5">
      <Field label="Título">
        <TextInput control={control} name="subject" variant="bordered" />
      </Field>
      <Field label="Para">
        <TextInput
          control={control}
          name="to"
          variant="bordered"
          rows={1}
          placeholder="ejemplo@email.com; otro@email.com"
        />
      </Field>
      <Field label="Cc">
        <TextInput
          control={control}
          name="cc"
          variant="bordered"
          rows={1}
          placeholder="ejemplo@email.com; otro@email.com"
        />
      </Field>
      <Field label="Bcc">
        <TextInput
          control={control}
          name="bcc"
          variant="bordered"
          rows={1}
          placeholder="ejemplo@email.com; otro@email.com"
        />
      </Field>
      {/* <ContactsSelector
        control={control}
        name="to"
        label="Para"
        contacts={allContacts}
      />
      <ContactsSelector
        control={control}
        name="cc"
        label="Cc"
        contacts={allContacts}
      />
      <ContactsSelector
        control={control}
        name="bcc"
        label="Bcc"
        contacts={allContacts}
      /> */}

      <Field label="" className="border-2 rounded-md p-2">
        <RichTextEditor control={control} name="body" />
      </Field>
    </div>
  );
};

export default EmailForm;

import { handleErrors } from '@/core/utils';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader
} from '@nextui-org/react';
import { Component } from 'react';

export interface DialogProps {
  id?: string;
  okLabel?: string | boolean;
  title?: string;
  open?: boolean;
  onOpenChange(): void;
  hideCloseButton?: boolean;
  onClose?(...params: any[]): void;
  fullScreen?: boolean;
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | 'full';
  actionsOff?: boolean;
  //   maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  //   dividersOff?: boolean;
  //   fixed?: boolean;
  actions?(dialog: DialogWidget, opener?: any, okDisabled?: boolean): any;
  esc?: boolean;
  children(dialog: DialogWidget): any;
  formOff?: boolean;
  notifications?: {
    error: (msg: string, ms?: number) => void;
  };
  //   modalProps: {};
  [key: string]: any;
}

export class DialogWidget extends Component<DialogProps> {
  i18n: {};
  state = {
    okDisabled: false
  };

  constructor(props: any) {
    super(props);
    this.close = this.close.bind(this);
  }

  onOk = async (action: string = 'ok') => {
    this.close(action);
  }; //To be defined on children

  _onOk = (action: string) => async e => {
    try {
      this.setState({ okDisabled: true });
      await this.onOk(action);
    } catch (err) {
      console.error('dialog err', err);
      handleErrors(err, this.props.notifications!.error, this.i18n);
    } finally {
      setTimeout(() => {
        this.setState({ okDisabled: false });
      }, 1000);
    }
  };

  setI18n = i18n => {
    this.i18n = i18n;
  };

  // we need "...a" so typescript does not complain when we pass arguments in calls.
  close(...a) {
    const args = Array.prototype.slice.call(arguments);
    const { onClose, id, esc } = this.props;

    if (!esc && a[1] === 'backdropClick') return;
    if (onClose) onClose(id, ...args);
  }

  render() {
    const {
      okLabel,
      title,
      open,
      onOpenChange,
      hideCloseButton = false,
      //   maxWidth = 'sm',
      fullScreen,
      size,
      actionsOff,
      children,
      actions,
      id,
      //   fixed,
      esc,
      //   dividersOff,
      formOff,
      ...rest
    } = this.props;

    const { okDisabled } = this.state;

    const onFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      this._onOk('save')(e);
    };

    return (
      <Modal
        isOpen={open}
        onOpenChange={onOpenChange}
        size={fullScreen ? 'full' : size || 'md'}
        hideCloseButton={hideCloseButton}
        isKeyboardDismissDisabled={!esc}
      >
        <ModalContent>
          {() => (
            <>
              {title && (
                <ModalHeader className="flex flex-col gap-1">
                  {title}
                </ModalHeader>
              )}

              <ModalBody>
                {formOff ? (
                  children(this)
                ) : (
                  <form onSubmit={onFormSubmit} noValidate>
                    {children(this)}
                    <button type="submit" className="hidden" />
                  </form>
                )}

                {(actions && actions(this, opener, okDisabled)) ||
                  (!actionsOff && (
                    <div className="flex flex-row gap-3 items-baseline justify-end">
                      <Button
                        onPress={() => this.close('cancel')}
                        color="default"
                      >
                        Cerrar
                      </Button>

                      {okLabel && (
                        <Button
                          onPress={this._onOk('save')}
                          color="primary"
                          disabled={okDisabled}
                        >
                          {okLabel === true ? 'OK' : okLabel}
                        </Button>
                      )}
                    </div>
                  ))}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  }
}

const Dialog = (props: DialogProps) => {
  // const notifications = useNotifications();
  return (
    <DialogWidget
      {...props}
      //   fullScreen={
      //     props.fullScreen !== undefined ? props.fullScreen : fullScreen
      //   }
      //   notifications={notifications}
    />
  );
};

export default Dialog;

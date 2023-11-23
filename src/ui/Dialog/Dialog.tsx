import { handleErrors } from '@/core/utils';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader
} from '@nextui-org/react';
import { Component } from 'react';
import Title from '../Title';

export interface DialogProps {
  id?: string;
  okLabel?: string | boolean;
  title?: string;
  isOpen?: boolean;
  hideCloseButton?: boolean;
  close?(...params: any[]): void;
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
  actions?(dialog: DialogWidget, okDisabled?: boolean): any;
  esc?: boolean;
  children(dialog: DialogWidget): any;
  formOff?: boolean;
  notifications?: {
    error: (msg: string, ms?: number) => void;
  };
  [key: string]: any;
}

export class DialogWidget extends Component<DialogProps> {
  i18n: any = {};
  state = {
    okDisabled: false
  };

  constructor(props: any) {
    super(props);
    this.close = this.close.bind(this);
  }

  onOk = async (action: string = 'ok'): Promise<any> => {
    this.close(action);
  }; //To be defined on children

  _onOk = (action: string) => async () => {
    try {
      this.setState({ okDisabled: true });
      await this.onOk(action);
    } catch (err) {
      console.error('dialog err', err);
      handleErrors(err, this.props.notifications!.error, this.i18n);
    } finally {
      setTimeout(() => {
        this.setState({ okDisabled: false });
      }, 1500);
    }
  };

  setI18n = (i18n: any) => {
    this.i18n = i18n;
  };

  // we need "...a" so typescript does not complain when we pass arguments in calls.
  close(...a: any[]) {
    const args = Array.prototype.slice.call(arguments);
    const { close, id, esc } = this.props;

    if (!esc && a[1] === 'backdropClick') return;
    if (close) close(id, ...args);
  }

  render() {
    const {
      okLabel,
      title,
      isOpen,
      //   maxWidth = 'sm',
      hideCloseButton = false,
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
      this._onOk('save')();
    };

    return (
      <Modal
        isOpen={isOpen}
        size={fullScreen ? 'full' : size || 'md'}
        hideCloseButton
        // hideCloseButton={hideCloseButton}
        isKeyboardDismissDisabled={!esc}
        className="green-light"
      >
        <ModalContent>
          {() => (
            <>
              {title && (
                <ModalHeader className="flex flex-col gap-1">
                  <Title>{title}</Title>
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

                {(actions && actions(this, okDisabled)) ||
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

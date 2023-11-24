import toast from 'react-hot-toast';

export const useNotifications = () => {
  const success = (
    message: string,
    autoHideDuration: number | undefined = 2000
  ) => {
    toast.success(message, { duration: autoHideDuration });
  };

  const error = (
    messageOrErr: any,
    autoHideDuration: number | undefined = 3000
  ) => {
    let msg = messageOrErr;
    if (typeof messageOrErr !== 'string') {
      if (messageOrErr.message) {
        msg = messageOrErr.message;
      }
    }
    toast.error(msg, { duration: autoHideDuration });
  };

  const info = (
    message: string,
    autoHideDuration: number | undefined = 1200
  ) => {
    toast(message, { duration: autoHideDuration });
  };

  const message = (
    message: string,
    autoHideDuration: number | undefined = 1200
  ) => {
    toast(message, { duration: autoHideDuration });
  };

  // const confirm = async message => {
  //   let response = await swal({
  //     title: message,
  //     buttons: {
  //       Cancel: true,
  //       OK: true
  //     }
  //   });

  //   if (response == 'OK') {
  //     return Promise.resolve();
  //   } else {
  //     return Promise.reject();
  //   }
  // };

  const confirm = async (msg: string): Promise<boolean> => {
    return false;
  };

  return {
    confirm,
    success,
    error,
    info,
    message
  };
};

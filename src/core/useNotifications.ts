import toast from 'react-hot-toast';

export const useNotifications = () => {
  const success = (message: string, autoHideDuration: number | null = 1200) => {
    const handler = toast.success(message, {
      duration: autoHideDuration
      // onClick: () => closeSnackbar(key)
    });
  };
  const error = (messageOrErr: any, autoHideDuration: number | null = 3000) => {
    let msg = messageOrErr;
    if (typeof messageOrErr !== 'string') {
      if (messageOrErr.message) {
        msg = messageOrErr.message;
      }
    }
    const handler = toast.error(msg, {
      duration: autoHideDuration
      // onClick: () => closeSnackbar(key)
    });
  };
  const info = (message: string, autoHideDuration: number | null = 1200) => {
    const handler = toast(message, {
      duration: autoHideDuration
      // onClick: () => closeSnackbar(key)
    });
  };
  const message = (message: string, autoHideDuration: number | null = 1200) => {
    const handler = toast(message, {
      duration: autoHideDuration
      // onClick: () => closeSnackbar(key)
    });
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

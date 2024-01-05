const FN_RESPONSE = {
  dollar: null,
  ok: true
};

const main = async ({ req, res, log, error }: any) => {
  try {
    const url = 'https://developers.syscom.mx/api/v1/tipocambio';
    // @ts-ignore
    const token = Bun.env['SYSCOM_TOKEN'];
    // log('token');
    // log(token);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw response;

    const dollar = await response.json();

    FN_RESPONSE.dollar = dollar.normal;
    log(FN_RESPONSE);
    return res.json(FN_RESPONSE);
  } catch (err) {
    error(err);
    FN_RESPONSE.ok = false;
    return res.json(FN_RESPONSE);
  }
};

export default main;

// main({
//   req: {},
//   res: { json: console.log },
//   log: console.log,
//   error: console.error
// });

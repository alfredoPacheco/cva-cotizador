const FN_RESPONSE = {
  dollar: null,
  ok: true
};

const main = async ({ req, res, log, error }: any) => {
  try {
    const url = 'https://api.tvc.mx/exchange-rates';
    const tvcToken = Bun.env['TVC_TOKEN'];
    log('tvcToken');
    log(tvcToken);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tvcToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw response;

    const dollar = await response.json();

    FN_RESPONSE.dollar = dollar;
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

import { get } from 'lodash';
import { Client, Databases, Query, Functions } from 'node-appwrite';

interface CategoryDto {
  id: string;
  name: string;
  level: number;
  productId: string;
}

interface BrandDto {
  $id?: string;
  name: string;
  id: string;
}

interface ProductDto {
  // $id: string;
  raw: string;
  productId: string;
  model: string;
  totalStock: number;
  title: string;
  brand: string;
  brandId: string;
  satKey: string;
  imgMain: string;
  privateLink: string;
  categories: CategoryDto[];
  pvol: string;
  brandLogo: string;
  link: string;
  icons: string;
  weight: string;
  existence: string;
  uom: string;
  uomCode: string;
  uomName: string;
  uomSat: string;
  height: string;
  large: string;
  width: string;
  prices: string;
  priceOne: string;
  priceSpecial: string;
  priceDiscount: string;
  priceList: string;
  note: string;
  attributes: string;
}

const client = new Client()
  .setEndpoint('https://app.do.inspiracode.com/v1')
  // @ts-ignore
  .setProject(Bun.env['APPWRITE_FUNCTION_PROJECT_ID'])
  // @ts-ignore
  .setKey(Bun.env['APPWRITE_API_KEY']);

const databases = new Databases(client);
const functions = new Functions(client);

const recursiveCall = async body => {
  await functions.createExecution('syscom-api', body, true);
  // main({
  //   req: {
  //     body
  //   },
  //   res: { json: console.log },
  //   log: console.log,
  //   error: console.error
  // });
};

const main = async ({ req, res, log, error }: any) => {
  try {
    // throw new Error('stop');
    const startTime = new Date().getTime();
    let currentTime = new Date().getTime();

    // @ts-ignore
    let startPage = Number(get(Bun.env, 'START_PAGE', 1));
    let startBrand;

    try {
      startPage = JSON.parse(req.body).startPage || startPage;
      log('startPage from request: ' + startPage);
    } catch {}

    try {
      startBrand = JSON.parse(req.body).startBrand;
      log('startBrand from request: ' + startBrand);
    } catch {}

    // @ts-ignore
    const TOKEN = Bun.env['TOKEN'];
    const brandUrl = 'https://developers.syscom.mx/api/v1/marcas';

    let existingBrands = await databases.listDocuments('syscom', 'brands', [
      Query.limit(999999999),
      Query.select(['$id']),
      Query.orderAsc('$id')
    ]);

    log('about to get brands from syscom api');

    const response = await fetch(brandUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();

    log('brands from syscom api: ' + json.length);

    // log(JSON.stringify(json, null, 2));

    const brandsFromSyscomApi = json;

    if (startBrand === undefined) {
      let brandsUpdated = 0;
      let brandsCreated = 0;
      log('going to process brands');
      for await (const brand of brandsFromSyscomApi) {
        let id = get(brand, 'id').toString();
        if (id === '0' || id === '1') {
          continue;
        }
        const payload: BrandDto = {
          name: get(brand, 'nombre'),
          id: get(brand, 'id').toString()
        };

        // log('payload');
        // log(payload);

        if (existingBrands.documents.some((doc: any) => doc.$id === id)) {
          log('updating brand: ' + id);
          await databases.updateDocument('syscom', 'brands', id, payload);
          brandsUpdated++;
        } else {
          log('creating brand: ' + id);
          await databases.createDocument('syscom', 'brands', id, payload);
          brandsCreated++;
        }
      }

      log('done processing brands');

      existingBrands = await databases.listDocuments('syscom', 'brands', [
        Query.limit(999999999),
        Query.select(['$id']),
        Query.orderAsc('$id')
      ]);

      if (existingBrands.documents.length === 0) {
        return res.json({ ok: false, message: 'No brands found' });
      }

      const firstBrand = existingBrands.documents[0].$id;
      log('calling again with first brand: ' + firstBrand);
      try {
        await recursiveCall(
          JSON.stringify({
            startBrand: firstBrand
          })
        );
      } catch (e) {
        error('error calling again with first brand: ' + firstBrand);
        error(e);
      }

      log({ brandsUpdated, brandsCreated });
      return res.json({ brandsUpdated, brandsCreated });
    }
    // END BRANDS ==========================

    log('going to process products');
    const existingProductsByBrand = await databases.listDocuments(
      'syscom',
      'products',
      [
        Query.limit(999999999),
        Query.select(['$id']),
        Query.equal('brand', startBrand)
      ]
    );

    log('existingProductsByBrand: ' + existingProductsByBrand.documents.length);
    // log(existingProductsByBrand);

    const productsUrl = new URL(
      'https://developers.syscom.mx/api/v1/productos'
    );

    const MAX_LOOP_TIMES = 999999999;
    // const MAX_LOOP_TIMES = 2;
    const MAX_ATTEMPTS = 3;

    let LOOP_COUNT = 1;
    let ATTEMPTS_COUNT = 1;

    let CURRENT_PAGE = startPage;
    let CURRENT_BRAND = startBrand;

    let hasNextPage = false;

    let params = {
      orden: 'modelo:asc',
      marca: CURRENT_BRAND,
      pagina: CURRENT_PAGE.toString()
    };

    Object.keys(params).forEach(key =>
      productsUrl.searchParams.append(key, params[key])
    );

    do {
      try {
        const url = new URL(productsUrl);
        url.searchParams.set('pagina', CURRENT_PAGE.toString());
        url.searchParams.set('marca', CURRENT_BRAND);

        log('url');
        log(url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        });

        const json = await response.json();

        // log(JSON.stringify(json, null, 2));

        const products = json.productos;
        const paginas = Number(get(json, 'paginas', 1));
        const cantidad = Number(get(json, 'cantidad', 0));
        log('paginas: ' + paginas);
        log('cantidad: ' + cantidad);

        for await (const product of products) {
          log(
            'goint to process page: ' +
              CURRENT_PAGE +
              ', current brand: ' +
              CURRENT_BRAND +
              ', LOOP_COUNT: ' +
              LOOP_COUNT
          );

          const productId = get(product, 'producto_id').toString();
          const payload: ProductDto = {
            raw: JSON.stringify(product),
            productId: productId,
            model: get(product, 'modelo'),
            totalStock: get(product, 'total_existencia'),
            title: get(product, 'titulo'),
            brand: get(product, 'marca'),
            brandId: CURRENT_BRAND,
            satKey: get(product, 'sat_key'),
            imgMain: get(product, 'img_portada'),
            privateLink: get(product, 'link_privado'),
            categories: (get(product, 'categorias', []) as any[]).map(item => ({
              id: get(item, 'id'),
              name: get(item, 'nombre'),
              level: get(item, 'nivel'),
              productId,
              $id: [productId, get(item, 'id')].join('-')
            })),
            pvol: get(product, 'pvol'),
            brandLogo: get(product, 'marca_logo'),
            link: get(product, 'link'),
            icons: JSON.stringify(get(product, 'iconos'), []),
            weight: get(product, 'peso'),
            existence: JSON.stringify(get(product, 'existencia', {})),
            uom: JSON.stringify(get(product, 'unidad_de_medida', {})),
            uomCode: get(product, 'unidad_de_medida.codigo_unidad'),
            uomName: get(product, 'unidad_de_medida.nombre'),
            uomSat: get(product, 'unidad_de_medida.clave_unidad_sat'),
            height: get(product, 'alto'),
            large: get(product, 'largo'),
            width: get(product, 'ancho'),
            prices: JSON.stringify(get(product, 'precios', {})),
            priceOne: get(product, 'precios.precio_1'),
            priceSpecial: get(product, 'precios.precio_especial'),
            priceDiscount: get(product, 'precios.precio_descuento'),
            priceList: get(product, 'precios.precio_lista'),
            note: get(product, 'nota'),
            attributes: JSON.stringify(get(product, 'atributos', {}))
          };

          // log(payload);
          if (
            existingProductsByBrand.documents.some(
              (doc: any) => doc.$id === productId
            )
          ) {
            log('updating product: ' + productId);
            await databases.updateDocument(
              'syscom',
              'products',
              productId,
              payload
            );
          } else {
            log('creating product: ' + productId);
            await databases.createDocument(
              'syscom',
              'products',
              productId,
              payload
            );
          }
        }

        hasNextPage = paginas > CURRENT_PAGE;
        log('end of page: ' + CURRENT_PAGE);
        log('hasNextPage: ' + hasNextPage);
        CURRENT_PAGE++;
        ATTEMPTS_COUNT = 1;
        LOOP_COUNT++;
      } catch (e) {
        error(e);
        log('Attempt: ' + ATTEMPTS_COUNT);
        log('Current Page: ' + CURRENT_PAGE);
        log('Loop Count: ' + LOOP_COUNT);
        ATTEMPTS_COUNT++;

        if (ATTEMPTS_COUNT > MAX_ATTEMPTS) {
          error(e);
          throw e;
        }
      }
      currentTime = new Date().getTime();
      // log('time elapsed: ' + (currentTime - startTime) / 1000);
    } while (
      hasNextPage &&
      ATTEMPTS_COUNT <= MAX_ATTEMPTS &&
      LOOP_COUNT <= MAX_LOOP_TIMES &&
      currentTime - startTime < 1000 * 60 * 3
    );

    log('end of while loop');
    log('hasNextPage: ' + hasNextPage);

    if (
      hasNextPage &&
      ATTEMPTS_COUNT <= MAX_ATTEMPTS &&
      LOOP_COUNT <= MAX_LOOP_TIMES
    ) {
      log("didn't finish, calling again with next page:" + CURRENT_PAGE);

      try {
        await recursiveCall(
          JSON.stringify({
            startPage: CURRENT_PAGE,
            startBrand: CURRENT_BRAND
          })
        );
      } catch (e) {
        error('error calling again with next page:' + CURRENT_PAGE);
        error(e);
      }
    }

    if (!hasNextPage) {
      // IMPORTANT!!! Do not print this, it throws an error when running in appwrite
      // I think it is thrown because the object is so big to print it in the console
      // log(JSON.stringify(existingBrands, null, 2));

      const nextBrand =
        existingBrands.documents[
          existingBrands.documents.findIndex(
            (brand: any) => brand.$id === CURRENT_BRAND
          ) + 1
        ];

      if (nextBrand) {
        log('calling again with next brand: ' + nextBrand.$id);

        try {
          await recursiveCall(
            JSON.stringify({
              startBrand: nextBrand.$id
            })
          );
        } catch (e) {
          error('error calling again with next brand: ' + nextBrand.$id);
          error(e);
        }
      }
    }

    return res.json({ ok: true });
  } catch (e) {
    error('outer error:');
    error(e);
  }
};

export default main;

// recursiveCall(
//   JSON.stringify({
//     startBrand: '3icorporation'
//   })
// );

import { get } from 'lodash';
import { Client, Databases, Query, Functions } from 'node-appwrite';

interface InventoryDto {
  name: string;
  quantity: number;
  warehouseId: string;
}

interface ProductDto {
  // $id: string;
  raw: string;
  tvcModel: string;
  providerModel: string;
  tvcId: number;
  name: string;
  type: string;
  brand: string;
  brandId: number;
  categoryId: number;
  category: string;
  satKey: string;
  productFlowType: string;
  stageId: number;
  stageName: string;
  listPrice: string;
  distributorPrice: string;
  mediaMainImage: string;
  mediaGallery: string[];
  mediaVideos: string[];
  mediaDocuments: string[];
  // overviews: string;
  piecesPerBox: number;
  pieceHeight: string;
  pieceLength: string;
  pieceWidth: string;
  pieceWeight: string;
  boxHeight: string;
  boxLength: string;
  boxWidth: string;
  boxWeight: string;
  breadcrumb: string;
  breadcrumbTree: string;
  inventory: InventoryDto[];
}

// interface TVCProductDto {
//   tvc_model: string;
//   provider_model: string;
//   tvc_id: number;
//   name: string;
//   type: string;
//   brand: string;
//   brand_id: number;
//   category_id: number;
//   category: string;

//   category_breadcrumb: string;
//   category_breadcrumb_tree: string;

//   sat_key: string;
//   product_flow_type: string;
//   stage_id: number;
//   stage_name: string;

//   list_price: string;
//   distributor_price: string;

//   inventory_detailed: [];
//   media: {
//     main_image: string;
//     gallery: [];
//     documents: [];
//     videos: string;
//   };
//   overviews: [];
//   weights_and_dimensions: {
//     pieces_per_box: number;
//     piece_height: string;
//     piece_length: string;
//     piece_width: string;
//     piece_weight: string;
//     box_height: string;
//     box_length: string;
//     box_width: string;
//     box_weight: string;
//   };
// }

// This is your Appwrite function
// It's executed each time we get a request
// export default async ({ req, res, log, error }: any) => {
const main = async ({ req, res, log, error }: any) => {
  // @ts-ignore
  let startPage = Number(Bun.env['START_PAGE'] || 1);

  try {
    startPage = JSON.parse(req.body).startPage;
    log('startPage from request: ' + startPage);
  } catch {}

  const startTime = new Date().getTime();
  let currentTime = new Date().getTime();

  const client = new Client()
    .setEndpoint('https://app.do.inspiracode.com/v1')
    // @ts-ignore
    .setProject(Bun.env['APPWRITE_FUNCTION_PROJECT_ID'])
    // @ts-ignore
    .setKey(Bun.env['APPWRITE_API_KEY']);

  const databases = new Databases(client);
  const functions = new Functions(client);

  const existingProducts = await databases.listDocuments('tvc', 'products', [
    Query.limit(999999999),
    Query.select(['$id'])
  ]);

  const baseUrl = new URL('https://api.tvc.mx/products');

  let CURRENT_PAGE = startPage;
  const PER_PAGE = '100';
  const MAX_LOOP_TIMES = 999999999;
  // const MAX_LOOP_TIMES = 1;
  let LOOP_COUNT = 1;
  let ATTEMPTS_COUNT = 1;
  const MAX_ATTEMPTS = 3;

  let hasNextPage = false;

  let params = {
    // tvcIds: [4804], // Do not use like this, see below
    // tvcModels: ['RBM0220002', '42109'],
    withInventory: 'detailed',
    withPrice: true,
    withMedia: true,
    withOverviews: false,
    withWeightsAndDimensions: true,
    withCategoryBreadcrumb: true,
    perPage: PER_PAGE,
    page: CURRENT_PAGE.toString()
  };
  Object.keys(params).forEach(key =>
    baseUrl.searchParams.append(key, params[key])
  );

  // @ts-ignore
  const tvcToken = Bun.env['TVC_TOKEN'];

  do {
    try {
      const url = new URL(baseUrl);
      url.searchParams.set('page', CURRENT_PAGE.toString());
      // url.searchParams.append('tvcIds[]', '4804');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tvcToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const json = await response.json();

      // log(JSON.stringify(json, null, 2));

      const products = json.data;

      for await (const product of products) {
        log(
          'goint to process page: ' +
            CURRENT_PAGE +
            ', LOOP_COUNT: ' +
            LOOP_COUNT
        );
        // const payload: ProductDto = {
        const payload = {
          // $id: get(product, 'tvc_id').toString(),
          raw: JSON.stringify(product),
          tvcModel: get(product, 'tvc_model'),
          providerModel: get(product, 'provider_model'),
          tvcId: get(product, 'tvc_id'),
          name: get(product, 'name'),
          type: get(product, 'type'),
          brand: get(product, 'brand'),
          brandId: get(product, 'brand_id'),
          categoryId: get(product, 'category_id'),
          category: get(product, 'category'),
          // categoryBreadcrumb: get(product, 'category_breadcrumb'),
          satKey: get(product, 'sat_key'),
          productFlowType: get(product, 'product_flow_type'),
          stageId: get(product, 'stage_id'),
          stageName: get(product, 'stage_name'),
          listPrice: get(product, 'list_price'),
          distributorPrice: get(product, 'distributor_price'),
          mediaMainImage: get(product, 'media.main_image'),
          mediaGallery: get(product, 'media.gallery'),
          mediaDocuments: get(product, 'media.documents'),
          mediaVideos: get(product, 'media.videos'),
          // overviews: JSON.stringify(get(product, 'overviews', [])),
          piecesPerBox: get(product, 'weights_and_dimensions.pieces_per_box'),
          pieceHeight: get(product, 'weights_and_dimensions.piece_height'),
          pieceLength: get(product, 'weights_and_dimensions.piece_length'),
          pieceWidth: get(product, 'weights_and_dimensions.piece_width'),
          pieceWeight: get(product, 'weights_and_dimensions.piece_weight'),
          boxHeight: get(product, 'weights_and_dimensions.box_height'),
          boxLength: get(product, 'weights_and_dimensions.box_length'),
          boxWidth: get(product, 'weights_and_dimensions.box_width'),
          boxWeight: get(product, 'weights_and_dimensions.box_weight'),
          breadcrumb: get(product, 'category_breadcrumb'),
          breadcrumbTree: JSON.stringify(
            get(product, 'category_breadcrumb_tree', {})
          ),
          inventory: (get(product, 'inventory_detailed', []) as any[]).map(
            item => ({
              name: get(item, 'name'),
              quantity: get(item, 'quantity'),
              warehouseId: get(item, 'warehouse_id').toString(),
              $id: [get(product, 'tvc_id'), get(item, 'warehouse_id')].join('-')
            })
          )
        };

        // log(payload);
        if (
          existingProducts.documents.some(
            (doc: any) => doc.$id === payload.tvcId.toString()
          )
        ) {
          log('updating product: ' + payload.tvcId);
          await databases.updateDocument(
            'tvc',
            'products',
            payload.tvcId.toString(),
            payload
          );
        } else {
          log('creating product: ' + payload.tvcId);
          await databases.createDocument(
            'tvc',
            'products',
            payload.tvcId.toString(),
            payload
          );
        }
      }

      hasNextPage = json.links.next !== null;
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
    log('time elapsed' + (currentTime - startTime) / 1000);
  } while (
    hasNextPage &&
    ATTEMPTS_COUNT <= MAX_ATTEMPTS &&
    LOOP_COUNT <= MAX_LOOP_TIMES &&
    currentTime - startTime < 1000 * 60 * 3
  );

  if (
    hasNextPage &&
    ATTEMPTS_COUNT <= MAX_ATTEMPTS &&
    LOOP_COUNT <= MAX_LOOP_TIMES
  ) {
    log("didn't finish, calling again with next page:" + CURRENT_PAGE);
    functions.createExecution(
      // @ts-ignore
      Bun.env['APPWRITE_FUNCTION_ID'],
      JSON.stringify({
        startPage: CURRENT_PAGE
      }),
      true
    );
  }

  return res.json({ ok: true });
};

export default main;

// main({ res: { json: console.log }, log: console.log, error: console.error });

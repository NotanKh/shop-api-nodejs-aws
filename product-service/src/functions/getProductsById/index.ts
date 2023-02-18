import { handlerPath } from '@libs/handler-resolver';

export const getProductByIdFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    /* eslint-disable no-template-curly-in-string */
    PRODUCTS_TABLE_NAME: '${self:custom.productsTableName}',
    STOCK_TABLE_NAME: '${self:custom.stockTableName}',
  },
  events: [
    {
      http: {
        method: 'get',
        path: 'product/{id}',
        cors: true,
      },
    },
  ],
};

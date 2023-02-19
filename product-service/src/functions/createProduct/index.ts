import { handlerPath } from '@libs/handler-resolver';
import ProductSchema from './ProductSchema';

export const createProductFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    /* eslint-disable no-template-curly-in-string */
    PRODUCTS_TABLE_NAME: '${self:custom.productsTableName}',
    STOCK_TABLE_NAME: '${self:custom.stockTableName}',
  },
  events: [
    {
      http: {
        method: 'post',
        path: 'product',
        cors: true,
        request: {
          schemas: {
            'application/json': ProductSchema,
          },
        },
      },
    },
  ],
};

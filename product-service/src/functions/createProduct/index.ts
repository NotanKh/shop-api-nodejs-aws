import { handlerPath } from '@libs/handler-resolver';
import ProductSchema from './ProductSchema';

export const createProductFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
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

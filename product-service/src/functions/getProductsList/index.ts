import { handlerPath } from '@libs/handler-resolver';

export const getProductsFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'product/available',
        cors: true,
      },
    },
  ],
};

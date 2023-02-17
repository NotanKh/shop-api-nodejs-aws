import { handlerPath } from '@libs/handler-resolver';

export const getProductByIdFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
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

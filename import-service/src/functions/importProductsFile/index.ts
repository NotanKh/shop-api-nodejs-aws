import type { AWS } from '@serverless/typescript';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    // eslint-disable-next-line no-template-curly-in-string
    IMPORT_BUCKET: '${self:custom.importBucketName}',
  },
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: 'true',
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
      },
    },
  ],
} as AWS['functions']['events'];

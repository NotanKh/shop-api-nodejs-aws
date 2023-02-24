import type { AWS } from '@serverless/typescript';
import { handlerPath } from '@libs/handler-resolver';
/* eslint-disable no-template-curly-in-string */

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    IMPORT_BUCKET: '${self:custom.importBucketName}',
  },
  events: [
    {
      s3: {
        bucket: '${self:custom.importBucketName}',
        event: 's3:ObjectCreated:*',
        rules: [
          { prefix: 'uploaded/' },
        ],
        existing: true,
      },
    },
  ],
} as AWS['functions']['events'];

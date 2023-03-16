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
        authorizer: {
          // eslint-disable-next-line no-template-curly-in-string
          arn: 'arn:aws:lambda:${aws:region}:${aws:accountId}:function:authorization-service-dev-basicAuthorizer',
          name: 'basicTokenAuthorizer',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        },
      },
    },
  ],
} as AWS['functions']['events'];

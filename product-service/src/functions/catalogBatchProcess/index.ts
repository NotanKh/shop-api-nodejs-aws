import type { AWS } from '@serverless/typescript';
import { handlerPath } from '@libs/handler-resolver';

export const catalogBatchProcessFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: {
          'Fn::GetAtt': ['SQSProductsQueue', 'Arn'],
        },
      },
    },
  ],
} as AWS['functions'][0];

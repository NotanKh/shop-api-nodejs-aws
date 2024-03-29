/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

import { importProductsFile, importFileParser } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'shop-import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SQS_URL: 'https://sqs.us-east-1.amazonaws.com/${aws:accountId}/catalogItemsQueue',
    },
    iam: {
      role: {
        statements: [
          { Effect: 'Allow', Action: 's3:ListBucket', Resource: 'arn:aws:s3:::${self:custom.importBucketName}' },
          {
            Effect: 'Allow',
            Action: [
              's3:PutObject',
              's3:GetObject',
              's3:DeleteObject'],
            Resource: 'arn:aws:s3:::${self:custom.importBucketName}/*',
          },
          {
            Effect: 'Allow',
            Action: 'sqs:ListQueues',
            Resource: 'arn:aws:sqs:us-east-1:${aws:accountId}:*',
          },
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: 'arn:aws:sqs:us-east-1:${aws:accountId}:catalogItemsQueue',
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  resources: {
    Resources: {
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    importBucketName: 'shop-aws-import-s3-ankh',
  },
};

module.exports = serverlessConfiguration;

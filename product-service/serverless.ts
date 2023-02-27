/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

import {
  getProductByIdFunction, getProductsFunction, createProductFunction, catalogBatchProcessFunction,
} from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'shop-product-service',
  configValidationMode: 'error',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
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
      SQS_URL: { Ref: 'SQSProductsQueue' },
      PRODUCTS_TABLE_NAME: '${self:custom.productsTableName}',
      STOCK_TABLE_NAME: '${self:custom.stockTableName}',
    },
    iam: {
      role: {
        statements: [{
          Effect: 'Allow',
          Action: [
            'dynamodb:DescribeTable',
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem',
          ],
          Resource: [
            'arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:custom.productsTableName}',
            'arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:custom.stockTableName}',
          ],
        },
        {
          Effect: 'Allow',
          Action: 'sqs:*',
          Resource: [
            { 'Fn::GetAtt': ['SQSProductsQueue', 'Arn'] },
          ],
        }],
      },
    },
  },
  resources: {
    Resources: {
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:custom.productsTableName}',
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
          ],
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' },
          ],
        },
      },
      StockTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:custom.stockTableName}',
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
            { AttributeName: 'product_id', AttributeType: 'S' },
          ],
          KeySchema: [
            { AttributeName: 'product_id', KeyType: 'HASH' },
          ],
        },
      },
      SQSProductsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
    },
  },
  // import the function via paths
  functions: {
    getProductsFunction, getProductByIdFunction, createProductFunction, catalogBatchProcessFunction,
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
    productsTableName: 'cloud_shop_products',
    stockTableName: 'cloud_shop_stock',
  },
};

module.exports = serverlessConfiguration;

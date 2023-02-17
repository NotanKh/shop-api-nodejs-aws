import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { logger } from '@libs/logger';
import { ddbDocClient } from './index';

const { PRODUCTS_TABLE_NAME = 'products' } = process.env;

export const getProductsListData = async () => {
  const commandOptions = {
    TableName: PRODUCTS_TABLE_NAME,
  };

  const command = new ScanCommand(commandOptions);
  const data = await ddbDocClient.send(command);
  logger.info('Products list:', JSON.stringify(data));
  return data;
};

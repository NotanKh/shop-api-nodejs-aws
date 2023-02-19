import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { logger } from '@libs/logger';
import { handleError } from '@libs/error-handler';
import { ErrorCodes } from '@libs/constants';
import { ddbDocClient } from './index';
import StockModel from './models/StockModel';

const { STOCK_TABLE_NAME } = process.env;

export const getStockListData = async () => {
  const commandOptions = {
    TableName: STOCK_TABLE_NAME,
  };

  const command = new ScanCommand(commandOptions);
  const data = await ddbDocClient.send(command);
  logger.debug('Stock list:', JSON.stringify(data));
  return data.Items as StockModel[];
};

export const putStockData = async (item: StockModel): Promise<StockModel> => {
  try {
    const commandOptions = {
      TableName: STOCK_TABLE_NAME,
      Item: item,
    };
    const command = new PutCommand(commandOptions);
    const data = await ddbDocClient.send(command);
    logger.debug('New stock item:', JSON.stringify(data));
    return data.Attributes as StockModel;
  } catch (error) {
    throw handleError(error, logger, ErrorCodes.DATABASE_ERROR);
  }
};

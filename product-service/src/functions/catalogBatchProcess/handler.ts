import { SQSEvent } from 'aws-lambda';
import { butchCreateProducts } from '@services/products';
import { logger } from '@libs/logger';
import { CreateProductDTO } from '../../dto/createProductDTO';

const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    const products = event.Records.map((record) => JSON.parse(record.body) as CreateProductDTO);
    await butchCreateProducts(products);
    logger.info('Finish create products');
    return;
  } catch (error) {
    logger.error(error);
  }
};

export const main = catalogBatchProcess;

import { SQSEvent } from 'aws-lambda';
import { butchCreateProducts } from '@services/products';
import { logger } from '@libs/logger';
import { CreateProductDTO } from '../../dto/createProductDTO';

const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    const products = event.Records.map((record) => JSON.parse(record.body) as CreateProductDTO);
    const failedProducts = await butchCreateProducts(products);
    logger.info('Failed create products', JSON.stringify(failedProducts));
    return;
  } catch (error) {
    logger.error(error);
  }
};

export const main = catalogBatchProcess;

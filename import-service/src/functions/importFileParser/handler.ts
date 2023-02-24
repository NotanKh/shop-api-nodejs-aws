import { S3CreateEvent } from 'aws-lambda';
import { parseObject } from '@services/bucketService';
import { logger } from '@libs/logger';

const handler = async (event: S3CreateEvent): Promise<void> => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for await (const record of event.Records) {
      const { key } = record.s3.object;
      if (/\.csv&/.test(key)) {
        logger.error(new Error(`Error: object ${key} is is not in csv format`));
      }
      await parseObject(key);
    }
  } catch (error) {
    logger.error(error, event);
  }
};

export const main = handler;

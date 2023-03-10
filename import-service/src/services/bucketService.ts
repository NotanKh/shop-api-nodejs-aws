import {
  ListObjectsCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  CopyObjectCommandInput,
  CopyObjectCommand, DeleteObjectCommandInput, DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '@libs/logger';
import {
  BUCKET_DELIMITER, IMPORT_BUCKET, PARSED_PREFIX, UPLOADED_PREFIX,
} from '@services/constants';
import { handleError } from '@libs/error-handler';
import { s3Client } from '@libs/s3client';
import { parse, parseStream } from '@fast-csv/parse';
import { writeToQueue } from '@services/sqsService';

export const getObjectsList = async () => {
  try {
    const params = {
      Bucket: IMPORT_BUCKET,
      Prefix: UPLOADED_PREFIX,
      Delimiter: BUCKET_DELIMITER,
    };
    const command = new ListObjectsCommand(params);
    const listObjects = await s3Client.send(command);
    logger.debug('List of objects: \t', listObjects);
    return listObjects.Contents;
  } catch (error) {
    throw handleError(error, logger);
  }
};

export const uploadObject = async (filename) => {
  try {
    const params: PutObjectCommandInput = {
      Bucket: IMPORT_BUCKET,
      Key: `${UPLOADED_PREFIX}/${filename}`,
      ContentType: 'text/csv',
    };
    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    logger.debug(`Signed url for "${filename}": `, signedUrl);
    return signedUrl;
  } catch (error) {
    throw handleError(error, logger);
  }
};

const getObjectStream = async (key: string): Promise<ReadableStream> => {
  try {
    const params: GetObjectCommandInput = {
      Bucket: IMPORT_BUCKET,
      Key: key,
    };
    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);
    return data.Body as ReadableStream;
  } catch (error) {
    throw handleError(error, logger);
  }
};

const copyObject = async (sourceKey: string, key: string): Promise<void> => {
  try {
    const params: CopyObjectCommandInput = {
      Bucket: IMPORT_BUCKET,
      CopySource: `${IMPORT_BUCKET}/${sourceKey}`,
      Key: key,
    };
    const command = new CopyObjectCommand(params);
    await s3Client.send(command);
    logger.debug(`Object ${sourceKey} successfully copied to ${key}`);
  } catch (error) {
    throw handleError(error, logger);
  }
};

const deleteObject = async (key: string): Promise<void> => {
  try {
    const params: DeleteObjectCommandInput = {
      Bucket: IMPORT_BUCKET,
      Key: key,
    };
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    logger.debug(`Object ${key} was successfully deleted`);
  } catch (error) {
    throw handleError(error, logger);
  }
};

const processStreamRow = async (row) => {
  try {
    logger.info('Row:\t', row);
    await writeToQueue(row);
  } catch (error) {
    logger.error(`An Error while processing row ${row}`, error);
  }
};

export const parseObject = async (key: string): Promise<void> => {
  try {
    const objectStream = await getObjectStream(key) as NodeJS.ReadableStream;

    objectStream.pipe(parse({ headers: true }));
    // eslint-disable-next-line no-restricted-syntax
    for await (const row of parseStream(objectStream, { headers: true })) {
      await processStreamRow(row);
    }
    logger.info('All rows parsed');
    await copyObject(key, key.replace(UPLOADED_PREFIX, PARSED_PREFIX));
    await deleteObject(key);
  } catch (error) {
    throw handleError(error, logger);
  }
};

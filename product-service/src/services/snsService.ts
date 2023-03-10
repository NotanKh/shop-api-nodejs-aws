import { PublishCommandInput, PublishCommand } from '@aws-sdk/client-sns';
import { handleError } from '@libs/error-handler';
import { logger } from '@libs/logger';
import { snsClient } from '@libs/sns';

const productsTopicArn = process.env.PRODUCTS_TOPIC_ARN;

export enum ProductEventType {
  create = 'create',
  error = 'error',
}

export const notifyProductsTopic = async (message, event:ProductEventType) => {
  try {
    const params: PublishCommandInput = {
      Message: JSON.stringify(message),
      TopicArn: productsTopicArn,
      MessageAttributes: event && {
        event: {
          DataType: 'String',
          StringValue: event,
        },
      },
    };
    const command = new PublishCommand(params);
    const { MessageId } = await snsClient.send(command);
    logger.debug(`Message ${MessageId} was sent;`);
    return;
  } catch (error) {
    throw handleError(error, logger);
  }
};

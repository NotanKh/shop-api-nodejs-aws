import { PublishCommandInput, PublishCommand } from '@aws-sdk/client-sns';
import { handleError } from '@libs/error-handler';
import { logger } from '@libs/logger';
import { snsClient } from '@libs/sns';

const productsTopicArn = process.env.PROCESS_TOPIC_ARN;

const formatProductsCreationMessage = (doneProducts, failedProducts): string => {
  const doneMsg = doneProducts.reduce((msg, product) => `${msg}\n${JSON.stringify(product)}`, 'Successfully created products:');
  const failedMsg = failedProducts.reduce((msg, product) => `${msg}\n${JSON.stringify(product)}`, 'Not created products:');
  return `${doneMsg}\n\t---\n${failedMsg}`;
};

export const notifyButchProductsCreation = async (doneProducts, failedProducts) => {
  try {
    const params: PublishCommandInput = {
      Message: formatProductsCreationMessage(doneProducts, failedProducts),
      TopicArn: productsTopicArn,
    };
    const command = new PublishCommand(params);
    const { MessageId } = await snsClient.send(command);
    logger.debug(`Message ${MessageId} was sent;`);
    return;
  } catch (error) {
    throw handleError(error, logger);
  }
};

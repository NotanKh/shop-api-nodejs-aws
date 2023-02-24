import { SendMessageCommand, SendMessageCommandInput } from '@aws-sdk/client-sqs';
import { sqsClient } from '@libs/sqs';
import { logger } from '@libs/logger';

const QueueUrl = process.env.SQS_URL;

export const writeToQueue = async (data) => {
  try {
    const params: SendMessageCommandInput = { QueueUrl, MessageBody: JSON.stringify(data) };
    const command = new SendMessageCommand(params);
    const commandOutput = await sqsClient.send(command);
    logger.info(`Message ${commandOutput.MessageId} sent`);
  } catch (error) {
    // const { requestId, cfId, extendedRequestId } = error.$metadata;
    logger.error('Send message failed', error);
  }
};

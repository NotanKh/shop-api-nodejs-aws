import { APIGatewayAuthorizerHandler } from 'aws-lambda';
import { logger } from '@libs/logger';
import { AUTHORIZER_TYPE, UNAUTHORISED } from './constants';
import { authorize } from '../../services/authorization-service';

const handler: APIGatewayAuthorizerHandler = (event, _ctx, cb) => {
  logger.debug('event: ', JSON.stringify(event));
  if (event.type !== AUTHORIZER_TYPE) {
    cb(UNAUTHORISED);
    return;
  }
  try {
    const { authorizationToken, methodArn } = event;
    const [, encodedCreds] = authorizationToken.split(' ');
    if (!encodedCreds) {
      cb(UNAUTHORISED);
    }
    const policyDocument = authorize(encodedCreds, methodArn);
    logger.debug(policyDocument);
    cb(null, { principalId: encodedCreds, policyDocument });
    return;
  } catch (error) {
    logger.error(`${UNAUTHORISED}: ${error.message}`);
    cb(null, error);
  }
};

export const main = handler;

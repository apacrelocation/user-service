import jwt from 'jsonwebtoken';

function buildAllowAllPolicy(event, principalId) {
  const tmp = event.methodArn.split(':');
  const awsAccountId = tmp[4];
  const awsRegion = tmp[3];
  const apiGatewayArnTmp = tmp[5].split('/');
  const restApiId = apiGatewayArnTmp[0];
  const stage = apiGatewayArnTmp[1];
  const apiArn = 'arn:aws:execute-api:' + awsRegion + ':' + awsAccountId + ':' +
    restApiId + '/' + stage + '/*/*';
  const policy = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: [apiArn]
        }
      ]
    }
  };
  return policy;
}

exports.authorizer = function authorizer(event, context, callback) {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('===================Incoming Events===================');
      console.log('events ===>', JSON.stringify(event, null, 2));
    }
    const authorizationHeader = event.headers.Authorization || event.headers.authorization;
    if (!authorizationHeader) return callback('Unauthorized');

    const verification = jwt.verify(authorizationHeader, process.env.JWT_SECRET);

    const authResponse = buildAllowAllPolicy(event, verification.userId);

    return callback(null, authResponse);
  } catch (err) {
    console.error('error in Authorizer lambda', err);
    return callback('Unauthorized');
  }
};


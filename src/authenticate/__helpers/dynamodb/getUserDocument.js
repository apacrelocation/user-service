import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_SDK_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SDK_SECRET_KEY,
  region: process.env.AWS_REGION
});

const DynamoDB = new AWS.DynamoDB.DocumentClient();

const { USER_TABLE } = process.env;

export default async function getUserDocument(email) {
  const params = {
    TableName: USER_TABLE,
    IndexName: 'auth-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };
  return DynamoDB.query(params).promise().then(data => data.Items[0]);
}

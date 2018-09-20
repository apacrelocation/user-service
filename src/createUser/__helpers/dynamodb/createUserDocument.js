import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';

AWS.config.update({
  accessKeyId: process.env.AWS_SDK_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SDK_SECRET_KEY,
  region: process.env.AWS_REGION
});

const DynamoDB = new AWS.DynamoDB.DocumentClient();

const { USER_TABLE } = process.env;

export default async function createUserDocument(user) {
  const existingUser = await DynamoDB.get({
    TableName: USER_TABLE,
    Key: {
      adminEmail: user.adminEmail,
      email: user.email
    }
  }).promise().then(data => data.Item);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  const params = {
    TableName: USER_TABLE,
    Item: {
      ...user,
      password: bcrypt.hashSync('test123', 10),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
  return DynamoDB.put(params).promise().then(() => params.Item);
}

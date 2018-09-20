import { parseAndGetAPIGatewayInput } from './__helpers/utilities/parseAndGetAPIGatewayInput';
import getErrorMessage from './__helpers/utilities/getErrorMessage';
import createUserDocument from './__helpers/dynamodb/createUserDocument';

function validateUser(user) {
  if (!user.email) {
    throw new Error('email is required field');
  }
  if (user.userType !== 'agency' && user.userType !== 'individual') {
    throw new Error('userType is required field');
  }
  if (user.userType === 'agency' && (!user.adminEmail && user.admin.toString() !== 'true')) {
    throw new Error('adminEmail is required field for non-admin agency users');
  }
}

module.exports.createUser = async function createUser(events, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    let {
      params: user
    } = parseAndGetAPIGatewayInput(events);

    validateUser(user);

    // transforming individual or admin agency users
    if (!user.adminEmail) {
      user.adminEmail = user.email;
    }

    user = await createUserDocument(user);

    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        error: false,
        errorMessage: '',
        successMessage: 'User created successfully.',
        result: user
      })
    });
  } catch (err) {
    console.error('Error in creating user document', err);
    callback(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        error: true,
        errorMessage: getErrorMessage(err)
      })
    });
  }
};

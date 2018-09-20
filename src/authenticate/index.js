import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { parseAndGetAPIGatewayInput } from './__helpers/utilities/parseAndGetAPIGatewayInput';
import getErrorMessage from './__helpers/utilities/getErrorMessage';
import getUserDocument from './__helpers/dynamodb/getUserDocument';

module.exports.authenticate = async function authenticate(events, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const {
      params
    } = parseAndGetAPIGatewayInput(events);

    if (!params.email || !params.password) {
      throw new Error('Email/Password missing');
    }

    const user = await getUserDocument(params.email);

    if (!user) {
      throw new Error('No user found with that email');
    }

    const verification = await bcrypt.compare(params.password, user.password);

    if (!verification) {
      throw new Error('Invalid Email/Password');
    }

    const jwtToken = jwt.sign({
      email: params.email
    }, process.env.JWT_SECRET);

    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        error: false,
        errorMessage: '',
        successMessage: 'User authenticated successfully.',
        result: jwtToken
      })
    });
  } catch (err) {
    console.error('Error in authenticating user', err);
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

/**
 * @param  {JSON} events
 * Extracts input parameter based on HTTP Method for lambda function
 */
export function parseAndGetAPIGatewayInput(events) {
  if (process.env.NODE_ENV === 'development') {
    console.log('===================Incoming Events===================');
    console.log('events ===>', JSON.stringify(events, null, 2));
  }
  if (events.httpMethod === 'GET') {
    return {
      params: events.queryStringParameters || {}
    };
  } else if (events.httpMethod === 'POST') {
    return {
      params: JSON.parse(events.body)
    };
  }
  throw new Error('Invalid HTTP Request Method');
}

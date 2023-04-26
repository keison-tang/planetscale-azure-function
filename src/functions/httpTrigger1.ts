import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';

import * as mysql from 'mysql2/promise';

export async function httpTrigger1(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(
    `Http function processed ${request.method} request for url "${request.url}"`
  );

  try {
    const connection: mysql.Connection = await mysql.createConnection(
      process.env['PLANETSCALE_CONNECTION_STRING']
    );

    await connection.connect();
    context.log('Succesfully connected to PlanetScale!');

    return { status: 200 };
  } catch (error) {
    context.log(error.stack);
    return { status: 500, body: error };
  }
}

app.http('httpTrigger1', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: httpTrigger1,
});

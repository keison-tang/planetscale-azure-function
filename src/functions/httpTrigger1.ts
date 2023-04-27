import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { RowDataPacket, FieldPacket } from 'mysql2';
import { Connection, createConnection } from 'mysql2/promise';

interface IUser extends RowDataPacket {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export async function httpTrigger1(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(
    `Http function processed ${request.method} request for url "${request.url}"`
  );

  try {
    const connection: Connection = await createConnection(
      process.env['PLANETSCALE_CONNECTION_STRING']
    );

    await connection.connect();
    context.log('Succesfully connected to PlanetScale!');

    if (request.method === 'GET') {
      const [rows]: [IUser[], FieldPacket[]] = await connection.execute(
        'SELECT * FROM users'
      );
      return { status: 200, jsonBody: rows };
    }

    return { status: 500 };
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

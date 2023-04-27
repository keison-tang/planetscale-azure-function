import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { RowDataPacket, FieldPacket, ResultSetHeader } from 'mysql2';
import { Connection, createConnection } from 'mysql2/promise';

interface IRequestBody {
  email: string;
  first_name: string;
  last_name: string;
}

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
    } else if (request.method === 'POST') {
      const reqBodyString: string = await request.text();

      if (!reqBodyString) {
        return { status: 400, body: 'Request body must not be empty.' };
      }

      const reqBody: IRequestBody = JSON.parse(reqBodyString);

      if (!reqBody.email || !reqBody.first_name || !reqBody.last_name) {
        return {
          status: 400,
          body: 'Request missing required body parameter(s).',
        };
      }

      const [result]: [ResultSetHeader, FieldPacket[]] =
        await connection.execute(
          'INSERT INTO `users` (email, first_name, last_name) VALUES (?, ?, ?);',
          [reqBody.email, reqBody.first_name, reqBody.last_name]
        );

      return {
        status: 200,
        body: `New user inserted with id of ${result.insertId}`,
      };
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

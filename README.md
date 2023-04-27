# planetscale-azure-function

- Basic example of how to use [PlanetScale](https://planetscale.com) with Azure Functions
  - Azure Functions Node.js programming model v4
- HTTP triggered Azure Function that supports GET and POST methods
  - GET: executes a SELECT command
  - POST: executes an INSERT command

## Prerequisite

- PlanetScale account, free tier is good enough
- Postman, to test the Azure Function
- Same configurations as the following [quickstart page - Node.js programming model v4](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-node?pivots=nodejs-model-v4).
  - Node.js 18.x or above
  - VS Code
  - The Azure Functions extension v1.10.4 or above for VS Code
  - Azure Functions Core Tools v4.0.5095 or above

## PlanetScale database setup

- Run the following commands in the PlanetScale dashboard console after you have created a database
- These are copied from the PlanetScale Node.js quickstart

```sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255),
  `last_name` varchar(255)
);
```

```sql
INSERT INTO `users` (id, email, first_name, last_name)
VALUES  (1, 'hp@example.com', 'Harry', 'Potter');
```

```sql
SHOW TABLES;
```

```sql
SELECT * FROM users;
```

## VS Code setup

- Add an app setting to `local.settings.json` called `PLANETSCALE_CONNECTION_STRING`
- In the PlanetScale database dashboard, create a new password and select 'Connect with: Node.js'
- Copy just the connection string value. Escape the double quotes with backslashes because we are using a `.json` file instead of a `.env`
- In production, you will need to add this under the Azure Function app's Application Settings

Example `local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
    "PLANETSCALE_CONNECTION_STRING": "mysql://abc123:pscale_pw_abc123@aws.connect.psdb.cloud/test-db?ssl={\"rejectUnauthorized\":true}"
  }
}
```

- Run

```bash
npm install
npm run start
```

- Accept incoming connections if a popup appears. If you are debugging, it may ask about storage, select Debug Anyway.

## Test with Postman

Enter into Postman the endpoint URL as specified in the terminal after starting your Azure Function

### GET

Returns all users

### POST

Inserts user and tells you the id of the newly inserted user.

Request body

```json
{
  "email": "string",
  "first_name": "string",
  "last_name": "string"
}
```

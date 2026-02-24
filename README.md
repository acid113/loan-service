# Loan Microservice

This is a simple microservice consumed by the Loan Site.

Tech stack: Node.js (TypeScript), Express.js, JWT for authenticatiom, Swagger for documentation, Supertest and Vitest for testing

## Project Structure

```
service
├── src
│   ├── __tests__
│   ├── controllers
│   ├── database
│   ├── docs
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── services
│   ├── util
│   └── index.ts
├── .env
├── package.json
└── README.md
```

## Installation

To install the necessary dependencies, run:

```bash
yarn
```

## Environment file setup

.env

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=
JWT_EXPIRES_IN=3600
```

## Run the Microservice (Dev mode)

To start the microservice in development mode, use the following command:

```bash
yarn dev
```

The service will be running on `http://localhost:3000`.

## Run tests

**Vitest** is the chosen framework

Run all tests

```bash
yarn test
```

Run tests with coverage

```bash
yarn test:coverage
```

Run specific test (ie. _canary.spec.ts_)

```bash
yarn test src/__tests__/canary.spec.ts
```

## Build the Microservice

Run this command

```bash
yarn build
```

## Endpoints

Base URL: http://localhost:3000/api/

### Authentication

- **POST** `/login` - login with username and password to get auth token

Note: Make sure the _JWT_SECRET_ and _JWT_EXPIRES_IN_ are configured in the **.env** file.

### Loans

**Required**: Bearer token to run these endpoints

- **GET** `/loans` - returns all loans
- **GET** `/loans/<id>` - returns a specific loan by ID
- **POST** `/loans` - creates a new loan
- **PUT** `/loans` - updates a specific loan
- **DELETE** `/loans/<id>` - removes a loan

Response structure

```
{
  message: <success or error message>,
  data: <data created, updated, or requested>
}
```

## Docker commands

Rebuilds the images and restarts fresh containers with clean volumes.

```bash
docker compose up --build
```

Stop services

```bash
docker compose down
```

Stop and remove containers, networks, and volumes (including your database data).

```bash
docker compose down -v
```

Restart container, if already created

```bash
docker compose up
```

## DB Server Setup

Setting up database credentials, schema, table, and trigger configured in the **docker-compose.yml**. Refer to **public/images** folder for screenshots on how to add the server using pgAdmin.

_Note: Individual SQL scripts available in **"scripts"** folder if you wish to setup the database manually._




## License

This project is licensed under the MIT License.

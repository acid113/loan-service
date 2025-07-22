# Loan Microservice

This is a simple microservice built with Node.js and TypeScript

## Project Structure

```
service
├── src
│   ├── controllers
│   ├── middlewares
│   ├── routes
│   ├── services
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

To install the necessary dependencies, run:

```
yarn
```

## Running the Microservice

To start the microservice in development mode, use the following command:

```
yarn dev
```

The service will be running on `http://localhost:3000`.

## Endpoints

### Health Check

- **GET** `/health`

This endpoint returns the health status of the microservice.

## License

This project is licensed under the MIT License.

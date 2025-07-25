// src/docs/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Loan API',
      version: '1.0.0',
      description: 'REST API for managing loans',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['src/controllers/*.ts'], // where your JSDoc comments live
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

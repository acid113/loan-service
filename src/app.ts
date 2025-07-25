import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

// import { middleware } from '#/middlewares/middleware';
import loanRoutes from '#/routes/loan';

const app = express();

app.use(express.json());
app.use('/api/loans', loanRoutes);

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;

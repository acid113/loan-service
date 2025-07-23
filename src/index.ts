import express from 'express';
import { middleware } from '#/middlewares/middleware';
import loanRoutes from '#/routes/loan';

const port = process.env.PORT ?? '9001';
const app = express();
app.use(express.json());
app.use('/loans', loanRoutes);

app.get('/', middleware, (req, res) => {
  console.log('Main route executed');
  res.status(200).send('Main route response');
});

app.get('/health', (req, res) => {
  res.status(200).send('Microservice is online!');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

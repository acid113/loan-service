import express from 'express';
import { middleware } from '#/middlewares/middleware';

const app = express();
const port = process.env.PORT ?? '9001';

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

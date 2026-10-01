import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

const port = Number(process.env.PORT ?? 8000);

app.listen(port, () => {
  console.log(`OctoFit API listening on port ${port}`);
});
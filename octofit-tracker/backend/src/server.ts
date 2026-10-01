import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import apiRouter from './routes/api.js';

const app = express();
app.use(express.json());

const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';
const frontendOrigin = codespaceName
  ? `https://${codespaceName}-5173.app.github.dev`
  : 'http://localhost:5173';

app.use(cors({ origin: frontendOrigin }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', apiBaseUrl });
});
app.use('/api', apiRouter);

const port = 8000;

connectDatabase()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`OctoFit API listening on port ${port}`);
    });
  })
  .catch((error: unknown) => {
    console.error('Unable to start OctoFit API:', error);
    process.exit(1);
  });
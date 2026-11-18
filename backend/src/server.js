import 'dotenv/config';
import app from './app.js';
import { env } from './config/env.js';
import { connectToDatabase, disconnectFromDatabase } from './db/connection.js';

let server;

async function start() {
  await connectToDatabase();
  server = app.listen(env.PORT, () => {
    console.warn(`Resume Analyzer API listening on port ${env.PORT}`);
  });
}

async function shutdown(signal) {
  console.warn(`${signal} received; shutting down`);
  if (server) await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  await disconnectFromDatabase();
}

process.once('SIGTERM', () => shutdown('SIGTERM').catch((error) => {
  console.error(error);
  process.exitCode = 1;
}));
process.once('SIGINT', () => shutdown('SIGINT').catch((error) => {
  console.error(error);
  process.exitCode = 1;
}));

start().catch((error) => {
  console.error('Unable to start the API:', error);
  process.exit(1);
});

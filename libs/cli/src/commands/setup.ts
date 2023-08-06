import { PROJECT_ROOT } from '../constants';
import fs from 'fs-extra';
import { resolve } from 'path';
import { logger } from '../gui';
import { execSync } from 'node:child_process';

export const setup = () => {
  // const __filename = fileURLToPath(import.meta.url);
  // const distPath = path.dirname(__filename);
  try {
    logger.info('Preparing server .env file...');
    fs.copySync(
      resolve(PROJECT_ROOT, 'apps/server/.env.example'),
      resolve(PROJECT_ROOT, 'apps/server/.env'),
      { overwrite: false, errorOnExist: true }
    );
  } catch {
    logger.warn('server .env file already exists, skipping.');
  }

  try {
    logger.info('Preparing client .env file...');
    fs.copySync(
      resolve(PROJECT_ROOT, 'apps/client/.env.example'),
      resolve(PROJECT_ROOT, 'apps/client/.env'),
      { overwrite: false, errorOnExist: true }
    );
  } catch {
    logger.warn('client .env file already exists, skipping.');
  }

  try {
    logger.info('Starting docker container...');
    execSync(`yarn  --cwd ${PROJECT_ROOT} db:start`);
  } catch (err) {
    logger.error(
      "Couldn't start the docker container. Make sure you have docker and docker-compose running on your machine."
    );
    throw err;
  }

  logger.info('Setting up database...');
  execSync(`yarn  --cwd ${PROJECT_ROOT} db:sync`);

  logger.success(
    'Project setup successfully. You can run yarn dev to start the project locally.'
  );
};

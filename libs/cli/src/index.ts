#!/usr/bin/env node

import { feature } from './commands/feature';
import { setup } from './commands/setup';
import { logger } from './gui.js';
import { Command } from 'commander';

(async function () {
  const program = new Command().name('Daria-CLI');
  program
    .command('feature')
    .description('Creates a new feature')
    .argument(
      '<name>',
      'The name of the feature you wish to create. It will be the name of the folder the created files will go to.'
    )
    .action(feature);

  program.command('setup').description('Setup the project').action(setup);
  await program.parseAsync();

  process.exit(0);
})().catch(err => {
  logger.error('Aborting...');
  if (err instanceof Error) {
    logger.error(err);
  } else {
    logger.error(
      'An unknown error has occurred. Please open an issue on github with the informations below:'
    );
    console.log(err);
  }
  process.exit(1);
});

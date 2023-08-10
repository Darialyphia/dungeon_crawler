import { Lifetime, asFunction, asValue } from 'awilix';
import { prisma } from './prisma';
import { errorMapper } from './mappers/error.mapper';
import { emitter } from './providers/event-emitter';
import { emailService } from './providers/mail.service';
import { createApp } from './app';
import { server } from './server';
import { createIo } from './io';

export const coreProviders = {
  app: asFunction(createApp, { lifetime: Lifetime.SINGLETON }),
  server: asFunction(server, { lifetime: Lifetime.SINGLETON }),
  io: asFunction(createIo, { lifetime: Lifetime.SINGLETON }),
  emitter: asValue(emitter),
  prisma: asValue(prisma),
  errorMapper: asFunction(errorMapper),
  emailService: asFunction(emailService)
};

import { asFunction, asValue } from 'awilix';
import { prisma } from './prisma';
import { errorMapper } from './mappers/error.mapper';
import { emitter } from './event-emitter';
import { emailService } from './mail.service';

export const coreProviders = {
  emitter: asValue(emitter),
  prisma: asValue(prisma),
  errorMapper: asFunction(errorMapper),
  emailService: asFunction(emailService)
};

import * as nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid';
import * as E from 'fp-ts/Either';
import handlebars from 'handlebars';
import { AnyObject, isDefined, isString } from '@dungeon-crawler/shared';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { UnexpectedError, errorFactory } from '../../../utils/errorFactory';
import { config } from '../../../config';
import { TransportOptions } from 'nodemailer';

export type EmailOptions = {
  template: string;
  head: { to: string; subject: string };
  variables?: AnyObject;
};

export type EmailService = {
  send(options: EmailOptions): Promise<E.Either<UnexpectedError, null>>;
};

export const emailService = (): EmailService => {
  const getTemplatePath = async (name: string) => {
    const path = resolve(process.cwd(), 'src/email-templates', `${name}.hbs`);

    if (!path || !isString(path)) {
      throw errorFactory.unexpected({ message: `Unknown email template: ${name}` });
    }

    return readFile(path, { encoding: 'utf-8' });
  };

  const getTransport = () => {
    const useMaildev =
      isDefined(config.MAILING.MAILDEV.HOST) && isDefined(config.MAILING.MAILDEV.PORT);

    const options = useMaildev
      ? ({
          // @ts-ignore
          host: config.MAILING.MAILDEV.HOST,
          port: config.MAILING.MAILDEV.PORT,
          secure: false,
          tls: {
            rejectUnauthorized: false
          }
        } as TransportOptions)
      : sendgridTransport({
          apiKey: config.MAILING.SENDGRID_API_KEY!
        });

    return nodemailer.createTransport(options);
  };

  return {
    async send(options: EmailOptions) {
      try {
        const compileSource = handlebars.compile(await getTemplatePath(options.template));

        const transporter = getTransport();
        await transporter.sendMail({
          from: 'Dungeon Crawler <ceo-of-based@gmail.com>',
          to: options.head.to,
          subject: options.head.subject,
          html: compileSource(options.variables)
        });

        return E.right(null);
      } catch (err) {
        console.log(err);
        return E.left(errorFactory.unexpected({ cause: new Error(String(err)) }));
      }
    }
  };
};

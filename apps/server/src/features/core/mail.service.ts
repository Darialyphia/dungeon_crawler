import * as nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid';
import handlebars from 'handlebars';
import { errorFactory } from '../../utils/errorFactory';
import { AnyObject, isDefined, isString } from '@dungeon-crawler/shared';
import { resolve } from 'path';
import { config } from '../../config';

export type EmailOptions = {
  template: string;
  head: { to: string; subject: string };
  variables?: AnyObject;
};

export type EmailService = {
  send(options: EmailOptions): Promise<void>;
};

export const emailService = (): EmailService => {
  const getTemplatePath = async (name: string) => {
    const path = resolve(process.cwd(), 'src/email-templates', `${name}.hbs`);

    if (!path || !isString(path)) {
      throw errorFactory.unexpected({ message: `Unknown email template: ${name}` });
    }

    return path;
  };
  const getTransport = () => {
    const useMaildev =
      isDefined(config.MAILING.MAILDEV.HOST) && isDefined(config.MAILING.MAILDEV.PORT);

    if (useMaildev) {
      return nodemailer.createTransport({
        // @ts-ignore
        host: config.MAILING.MAILDEV.HOST,
        port: config.MAILING.MAILDEV.PORT,
        secure: false,
        tls: {
          rejectUnauthorized: false
        }
      });
    }

    return nodemailer.createTransport(
      sendgridTransport({
        apiKey: config.MAILING.SENDGRID_API_KEY!
      })
    );
  };

  return {
    async send(options: EmailOptions) {
      const compileSource = handlebars.compile(await getTemplatePath(options.template));

      const transporter = getTransport();
      await transporter.sendMail({
        from: 'Dungeon Crawler <ceo-of-based@gmail.com>',
        to: options.head.to,
        subject: options.head.subject,
        html: compileSource(options.variables)
      });
    }
  };
};

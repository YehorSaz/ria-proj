import nodemailer, { Transporter } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import * as path from 'path';

import { configs } from '../configs/configs';
import { templates } from '../constatnts/email.constant';
import { EEmailAction } from '../enums/email.action.enum';

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      from: configs.SMTP_EMAIL,
      auth: {
        user: configs.SMTP_EMAIL,
        pass: configs.SMTP_PASSWORD,
      },
    });

    const hbsOptions = {
      viewEngine: {
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(
          process.cwd(),
          'src',
          'email-templates',
          'layouts',
        ),
        partialsDir: path.join(
          process.cwd(),
          'src',
          'email-templates',
          'partials',
        ),
      },
      viewPath: path.join(process.cwd(), 'src', 'email-templates', 'views'),
      extName: '.hbs',
    };

    this.transporter.use('compile', hbs(hbsOptions));
  }

  public async sendMail(
    to: string | string[],
    emailAction: EEmailAction,
    context: Record<string, string | number> = {},
  ) {
    const { subject, templateName } = templates[emailAction];

    context.frontUrl = configs.FRONT_URL;

    const mailOptions = {
      to,
      subject,
      template: templateName,
      context,
    };

    return this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();

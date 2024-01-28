import {
  DOMAIN_DISPLAY_NAME,
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
} from '@/models/constants';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { EmailTemplate, wrapEmailInTemplate } from './wrapEmailInTemplate';
import { Logger } from '@/utils/logger/Logger';

const mailgun = new Mailgun(FormData as any);
const DOMAIN = MAILGUN_DOMAIN;
const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY,
});

export interface SendEmailConfig {
  to: string;
  subject: string;
  html: string;
  customFromAddress?: string;
  template?: EmailTemplate;
}

export const sendEmail = async (options: SendEmailConfig) => {
  try {
    const { to, customFromAddress, subject, html, template } = options;
    await mg.messages.create(DOMAIN, {
      from: customFromAddress || `no-reply@${DOMAIN_DISPLAY_NAME}`,
      to,
      subject,
      html: wrapEmailInTemplate(html, template),
    });
  } catch (err) {
    Logger.error('sendEmail', 'error sending email', err, options);
  }
};

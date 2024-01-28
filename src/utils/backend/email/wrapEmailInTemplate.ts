import { defaultTemplate } from './templates/default';

export type EmailTemplate = 'no-template' | 'default';

export const wrapEmailInTemplate = (
  html: string,
  template: EmailTemplate = 'default'
) => {
  switch (template) {
    case 'no-template':
      return html;
    default:
      return defaultTemplate(html);
  }
};

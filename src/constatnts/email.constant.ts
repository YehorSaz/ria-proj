import { EEmailAction } from '../enums/email.action.enum';

export const templates = {
  [EEmailAction.REGISTER]: {
    templateName: 'register',
    subject: 'Hello',
  },
  [EEmailAction.FORGOT_PASSWORD]: {
    templateName: 'forgot-password',
    subject: 'Forgot pass',
  },
  [EEmailAction.NOT_ACTIVE_USER]: {
    templateName: 'not-active-user',
    subject: 'Inactive',
  },
  [EEmailAction.ANNOUNCEMENT_BAD_WORDS]: {
    templateName: 'announcement-bad-words',
    subject: 'announcement has a problem with bad words',
  },
  [EEmailAction.CHOOSE_OTHER_BRAND]: {
    templateName: 'choose-other-brand',
    subject: 'Other brand',
  },
};

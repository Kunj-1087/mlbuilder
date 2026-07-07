/**
 * Shared email types for MLBuilder transactional emails.
 */

export type EmailType =
  | 'newsletter_confirmation'
  | 'newsletter_welcome'
  | 'lead_magnet_delivery'
  | 'signup_welcome'
  | 'password_reset'
  | 'email_change_verification'
  | 'email_change_completed'
  | 'account_deletion_confirmation'
  | 'account_deletion_farewell';

export interface EmailTemplateProps {
  siteUrl?: string;
}

export interface NewsletterConfirmationProps extends EmailTemplateProps {
  confirmationToken: string;
}

export interface NewsletterWelcomeProps extends EmailTemplateProps {
  email: string;
}

export interface LeadMagnetDeliveryProps extends EmailTemplateProps {
  title: string;
  downloadToken: string;
  alreadySubscribed: boolean;
}

export interface SignupWelcomeProps extends EmailTemplateProps {
  firstName: string;
}

export interface PasswordResetProps extends EmailTemplateProps {
  resetToken: string;
  email: string;
}

export interface EmailChangeVerificationProps extends EmailTemplateProps {
  verificationToken: string;
  newEmail: string;
}

export interface EmailChangeCompletedProps extends EmailTemplateProps {
  maskedNewEmail: string;
  changeDate: string;
}

export interface AccountDeletionConfirmationProps extends EmailTemplateProps {
  confirmationToken: string;
}

export interface AccountDeletionFarewellProps extends EmailTemplateProps {
  // No additional props needed
}

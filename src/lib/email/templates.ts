export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export function buildVerificationEmail(verifyUrl: string): Omit<EmailPayload, "to"> {
  return {
    subject: "Verify your Hades Watch email",
    text: `Verify your email for Hades Watch:\n\n${verifyUrl}\n\nThis link expires in 24 hours.`,
    html: `<p>Verify your email for <strong>Hades Watch</strong>:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 24 hours.</p>`,
  };
}

export function buildPasswordResetEmail(resetUrl: string): Omit<EmailPayload, "to"> {
  return {
    subject: "Reset your Hades Watch password",
    text: `Reset your password for Hades Watch:\n\n${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, ignore this email.`,
    html: `<p>Reset your password for <strong>Hades Watch</strong>:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour. If you did not request this, ignore this email.</p>`,
  };
}

export function buildInviteEmail(inviteCode: string, registerUrl: string): Omit<EmailPayload, "to"> {
  return {
    subject: "Hades Watch invite",
    text: `You have been invited to Hades Watch.\n\nInvite code: ${inviteCode}\nRegister: ${registerUrl}`,
    html: `<p>You have been invited to <strong>Hades Watch</strong>.</p><p>Invite code: <code>${inviteCode}</code></p><p><a href="${registerUrl}">Register now</a></p>`,
  };
}

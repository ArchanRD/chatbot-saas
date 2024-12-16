export const emailTemplates = {
  invitation: (inviteUrl: string, organizationName: string) => ({
    subject: `Join ${organizationName} on Conversy`,
    html: `
        <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>You've been invited to join ${organizationName}</h2>
            <p>Someone has invited you to collaborate on their Conversy chatbot platform.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" 
                 style="background-color: #242424; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        display: inline-block;">
                Accept Invitation
              </a>
            </div>
            <p>This invitation will expire in 7 days.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              If you weren't expecting this invitation, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
        `,
  }),
};

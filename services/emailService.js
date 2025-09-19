import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      ...(html && { html }),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

  const subject = "Verify your email address";

  const text = `
    Welcome to our service!
    
    Please verify your email address by clicking the link below:
    ${verificationUrl}
    
    If you didn't create an account, please ignore this email.
    
    Thank you!
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to our service!</h2>
      
      <p>Thank you for registering with us. To complete your registration, please verify your email address.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
      
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        If you didn't create an account, please ignore this email.
      </p>
    </div>
  `;

  return await sendEmail(email, subject, text, html);
};

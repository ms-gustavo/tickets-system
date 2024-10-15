import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { SendEmailLoginProps } from "../../interfaces/interface";
import { AppError } from "../../shared/appErrors";
import { serverStringErrorsAndCodes } from "../../utils/serverStringErrorsAndCodes";
dotenv.config();

const emailUser = process.env.EMAIL_USER!;
const emailPass = process.env.EMAIL_PASS!;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

export class EmailService {
  static async sendEmail({
    email,
    subject,
    text,
    attachments,
  }: SendEmailLoginProps) {
    const mailOptions = {
      from: emailUser,
      to: email,
      subject,
      text,
      attachments: attachments ? attachments : undefined,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error: unknown) {
      console.error(
        `Erro ao enviar email para ${email}: ${(error as Error).message}`
      );
      throw new AppError(
        serverStringErrorsAndCodes.emailNotSent.message,
        serverStringErrorsAndCodes.emailNotSent.code
      );
    }
  }
}

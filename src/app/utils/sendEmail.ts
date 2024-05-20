import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: 'kashemaust@gmail.com',
      pass: 'ccnu bcla ztvp pijp',
    },
  });

  await transporter.sendMail({
    from: 'kashemaust@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset Password within 10 minute', // Subject line
    text: '', // plain text body
    html, // html body
  });
};

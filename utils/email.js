const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert: htmlToText } = require('html-to-text');
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.form = `Arslan <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: '25',
        auth: {
          user: '52771145420204',
          pass: '31d4a51dba6fae',
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send actual email
  async send(template, subject) {
    // 1)Render Html based on pug template
    const html = pug.renderFile(`S{__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2)Define an email option
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // 3)Create a trnasport and send email
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours Application');
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your pssword reset token (valid for only 10 minutes)',
    );
  }
};

const nodemailer = require('nodemailer');

const sendEmail = async(otp, email)=>{
    try {
        const testAccount = await nodemailer.createTestAccount();
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            debug: true,
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD
            }
        });
        return await transport.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: email,
            subject: "OTP Submission",
            html: `
    <h1>Reset Password</h1>
    <p> Here is your otp to change the password ${otp} </p>
  `
        });
    } catch (error) {
        console.log(`error in sending email ${error}`);
    }
}
module.exports = sendEmail;
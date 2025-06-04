import nodemailer from "nodemailer";

const sendEmail =async (option)=>{

    // create transporter object
    const transporter= nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    })

    // Configure the mailoptions object
    const mailOptions = {
    from: 'ChatApp support<support@email.com>',
    to: option.email,
    subject: option.subject,
    html: option.message
    };

    await transporter.sendMail(mailOptions)

}

export default sendEmail
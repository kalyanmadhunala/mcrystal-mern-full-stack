import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.STORE_MAIL,
        pass: process.env.PASS
    }
})

export default transporter;
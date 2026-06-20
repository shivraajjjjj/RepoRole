import nodemailer from 'nodemailer';

export async function sendOtpEmail({ to, otp }) {

   try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: 'Your OTP Code for RepoRole Authentication',
            html: `<p>Your OTP code is:
             <strong style="font-size: 18px;">${otp}</strong>. 
             It will expire in ${process.env.OTP_TTL_MINUTES || 10} minutes.</p>`,
        });
} catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
}

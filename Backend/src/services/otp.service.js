import crypto from 'node:crypto';
import prisma from '../config/prisma.js';

const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);

function hashOtp(otp) {
    return crypto.createHash('sha256').update(otp).digest('hex');
}

function generateOtp() {
    return String(crypto.randomInt(100000, 1000000));
}

export async function createEmailOtp(email) {
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await prisma.emailOtp.deleteMany({
        where: {
            email,
        },
    });

    await prisma.emailOtp.create({
        data: {
            email,
            otpHash,
            expiresAt,
        },
    });

    return otp;
}

export async function verifyEmailOtp(email, otp) {
    const record = await prisma.emailOtp.findFirst({
        where: {
            email,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    if (!record) {
        return { valid: false, reason: 'OTP not found' };
    }

    if (record.usedAt) {
        return { valid: false, reason: 'OTP already used' };
    }

    if (record.expiresAt < new Date()) {
        return { valid: false, reason: 'OTP expired' };
    }

    if (record.otpHash !== hashOtp(String(otp))) {
        return { valid: false, reason: 'OTP does not match' };
    }

    await prisma.emailOtp.update({
        where: { id: record.id },
        data: {
            usedAt: new Date(),
        },
    });

    return { valid: true };
}

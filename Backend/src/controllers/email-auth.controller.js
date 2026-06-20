import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { createEmailOtp, verifyEmailOtp } from '../services/otp.service.js';
import { sendOtpEmail } from '../services/mail.service.js';

const RECRUITER_ROLE = 'RECRUITER';

function getJwtSecret() {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    return process.env.JWT_SECRET;
}

function setAuthCookie(res, token) {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

async function issueTokenForUser(res, user) {
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        getJwtSecret(),
        { expiresIn: '7d' }
    );

    setAuthCookie(res, token);

    return token;
}

function normalizeEmail(value) {
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export async function sendRecruiterOtp(req, res) {
    try {
        const email = normalizeEmail(req.body?.email);
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && user.role !== RECRUITER_ROLE) {
            return res.status(403).json({
                success: false,
                message: 'Email authentication is only available for recruiters',
            });
        }

        const otp = await createEmailOtp(email);
        await sendOtpEmail({ to: email, otp });

        return res.status(200).json({
            success: true,
            message: 'OTP sent to email',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
            error: error.message,
        });
    }
}

export async function verifyRecruiterOtp(req, res) {
    try {
        const email = normalizeEmail(req.body?.email);
        const otp = String(req.body?.otp || '').trim();

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required',
            });
        }

        const otpResult = await verifyEmailOtp(email, otp);
        if (!otpResult.valid) {
            return res.status(400).json({
                success: false,
                message: otpResult.reason,
            });
        }

        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && user.role !== RECRUITER_ROLE) {
            return res.status(403).json({
                success: false,
                message: 'Email authentication is only available for recruiters',
            });
        }

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: email.split('@')[0],
                    role: RECRUITER_ROLE,
                    provider: 'EMAIL',
                },
            });
        }

        const token = await issueTokenForUser(res, user);

        return res.status(200).json({
            success: true,
            message: 'OTP verified',
            token,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to verify OTP',
            error: error.message,
        });
    }
}

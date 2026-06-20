import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export async function requireAuth(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            success: false,
            message: 'JWT_SECRET is not configured',
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const userId = payload.userId || payload.sub;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token',
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: error.message,
        });
    }
}
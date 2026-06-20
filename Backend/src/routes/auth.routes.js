import express from 'express';
const authRouter = express.Router();
import { githubAuth, githubAuthCallback, getMe, logout } from '../controllers/auth.controller.js';
import { sendRecruiterOtp, verifyRecruiterOtp } from '../controllers/email-auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';


authRouter.get('/github', githubAuth);
authRouter.get('/github/callback', githubAuthCallback);
authRouter.get('/me', requireAuth, getMe);
authRouter.post('/logout', logout);
authRouter.post('/recruiter/email/otp', sendRecruiterOtp);
authRouter.post('/recruiter/email/verify', verifyRecruiterOtp);

export default authRouter;
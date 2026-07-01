import axios from 'axios';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import prisma from '../config/prisma.js';
import {getAllRepos} from '../services/github.service.js'
const DEFAULT_SIGNUP_ROLE = 'SEEKER';
const PUBLIC_SIGNUP_ROLES = new Set(['SEEKER', 'RECRUITER']);

function normalizeSignupRole(value) {
    if (typeof value !== 'string') {
        return DEFAULT_SIGNUP_ROLE;
    }

    const normalized = value.toUpperCase();
    return PUBLIC_SIGNUP_ROLES.has(normalized) ? normalized : DEFAULT_SIGNUP_ROLE;
}

function resolveRoleFromState(stateToken, cookieNonce) {
    if (!stateToken || typeof stateToken !== 'string') {
        throw new Error('Missing OAuth state');
    }

    if (!cookieNonce || typeof cookieNonce !== 'string') {
        throw new Error('Missing OAuth state cookie');
    }

    const decoded = jwt.verify(stateToken, getJwtSecret());
    const stateNonce = typeof decoded?.nonce === 'string' ? decoded.nonce : '';

    if (!stateNonce || stateNonce !== cookieNonce) {
        throw new Error('Invalid OAuth state nonce');
    }

    return normalizeSignupRole(decoded?.role);
}

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
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}


export const githubAuth = async (req, res) => {
        
    const frontendUrl = req.query.frontendUrl || process.env.FRONTEND_URL;
    const state = jwt.sign({ frontendUrl }, getJwtSecret(),{ expiresIn: '10m' });
    try {
        if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_REDIRECT_URI) {
            return res.status(500).json({
                message: `GitHub OAuth is not configured for redirect URI: ${process.env.GITHUB_REDIRECT_URI}`,
                success: false,
            });
        }

        const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&state=${state}&scope=read:user user:email repo`
        res.redirect(url)
    } catch (error) {
        console.error("Error during GitHub authentication:", error)
        return res.status(500).json({ 
            message: "Internal server error",
                error: error.message,
                success: false
         })
    }
}

export const githubAuthCallback = async (req, res) => {
    try {
        const {code, state} = req.query;
        if (!code) {
            return res.status(400).json({ message: "Code not provided by GitHub", success: false })
        }

        if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
            return res.status(500).json({
                message: 'GitHub OAuth is not configured',
                success: false,
            });
        }

        const tokenResponse = await axios.post(
            `https://github.com/login/oauth/access_token`,
            new URLSearchParams({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: String(code),
            }).toString(),
            {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/x-www-form-urlencoded',
                },
            }
        )

        const accessToken = tokenResponse.data.access_token
        if (!accessToken) {
            return res.status(400).json({ message: "Failed to obtain access token from GitHub", success: false })
        }

        //use access token to get user info
        const userResponse = await axios.get(`https://api.github.com/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        const githubUser = userResponse.data
        const repos = await getAllRepos(githubUser.login, accessToken);
        //check if user exists in database
        let user = await prisma.user.findUnique({
            where: {
                githubId: githubUser.id.toString()
            }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    githubId: githubUser.id.toString(),
                    name: githubUser.name || githubUser.login,
                    avatarUrl: githubUser.avatar_url,
                    githubLogin: githubUser.login,
                    role: 'SEEKER',
                    provider: "GITHUB"
                }
            })
        }

        // check if repository data exists for the user, if not create it
        let repoData = await prisma.repository.findFirst({
            where: {
                userId: user.id
            }
        })

        let repoDataToCreate = repos.map(repo => ({
            githubRepoId: repo.id.toString(),
            owner: repo.owner.login,
            name: repo.name,
            url: repo.html_url,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            userId: user.id,
        }));

        if (!repoData) {
            await prisma.repository.createMany({
                data: repoDataToCreate,
                skipDuplicates: true
            })
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            getJwtSecret(),
            { expiresIn: "7d" }
        )

        setAuthCookie(res, token)
        const decodedState = jwt.verify(state, getJwtSecret());
        const frontendUrl = decodedState?.frontendUrl || process.env.FRONTEND_URL;
        if (frontendUrl) {
            return res.redirect(`${frontendUrl}`)
        }

        return res.status(200).json({
            success: true,
            message: 'GitHub authentication successful',
            token,
            user,
        })
    } catch (error) {
        console.error("Error during GitHub authentication callback:", error)
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            success: false
        })
    }
}

export const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
    });

    return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};

export const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });
        const repos = await prisma.repository.findMany({
            where: {userId: req.user.id}
        })

        return res.status(200).json({
            success: true,
            user,
            repos
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to load current user',
            error: error.message,
        });
    }
};

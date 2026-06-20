export function requireRecruiter(req, res, next) {
    const role = req.user?.role || req.body?.role || req.query?.role;

    if (role !== 'RECRUITER') {
        return res.status(403).json({
            success: false,
            message: 'Recruiter access required',
        });
    }

    next();
}
